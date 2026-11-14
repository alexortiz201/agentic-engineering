/*
 * Operator-owned Pi composer highlighting.
 *
 * This deliberately subclasses Pi's CustomEditor instead of implementing an
 * editor. Native submission, completion, paste/image handling, history, undo,
 * wrapping, Unicode-aware cursor navigation, and fullscreen mouse handling
 * therefore remain Pi-owned. Rendering only adds zero-width ANSI foreground
 * colors to Markdown fences and a small set of common fenced languages.
 */

import { CustomEditor, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { stripTerminalSequences } from "@earendil-works/pi-tui";

type Language = "bash" | "json" | "typescript";

type SourceLine = {
	text: string;
	language?: Language;
	fence?: boolean;
};

const FG = {
	fence: "\x1b[38;5;110m",
	keyword: "\x1b[38;5;141m",
	type: "\x1b[38;5;75m",
	string: "\x1b[38;5;114m",
	number: "\x1b[38;5;179m",
	comment: "\x1b[38;5;244m",
	variable: "\x1b[38;5;215m",
	inlineCode: "\x1b[38;5;110m",
	reset: "\x1b[39m",
} as const;

const TYPESCRIPT_TOKEN =
	/\/\/.*$|\/\*[\s\S]*?\*\/|`(?:\\.|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:abstract|as|async|await|break|case|catch|class|const|continue|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|of|private|protected|public|readonly|return|set|static|switch|throw|try|type|typeof|var|void|while|with|yield)\b|\b(?:any|bigint|boolean|never|number|object|string|symbol|unknown|undefined|void)\b|\b\d+(?:\.\d+)?\b/g;

const JSON_TOKEN =
	/"(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g;

const BASH_TOKEN =
	/#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\$\{?[A-Za-z_][A-Za-z0-9_]*\}?|\b(?:case|do|done|elif|else|esac|fi|for|function|if|in|then|until|while)\b|\b\d+\b/g;

function fenceLanguage(info: string): Language | undefined {
	switch (info.trim().toLowerCase()) {
		case "ts":
		case "tsx":
		case "typescript":
		case "js":
		case "jsx":
		case "javascript":
			return "typescript";
		case "json":
		case "jsonc":
			return "json";
		case "bash":
		case "sh":
		case "shell":
		case "zsh":
			return "bash";
		default:
			return undefined;
	}
}

/** Map logical prompt lines to their fenced-code language, without parsing text. */
export function classifyFencedLines(text: string): SourceLine[] {
	let language: Language | undefined;
	let marker: "`" | "~" | undefined;

	return text.split("\n").map((line) => {
		const fence = /^(?: {0,3})(`{3,}|~{3,})\s*([^\s]*)/.exec(line);
		if (fence) {
			const nextMarker = fence[1]![0] as "`" | "~";
			if (marker === nextMarker) {
				marker = undefined;
				language = undefined;
			} else if (!marker) {
				marker = nextMarker;
				language = fenceLanguage(fence[2] ?? "");
			}
			return { text: line, fence: true };
		}
		return { text: line, language };
	});
}

function color(token: string, code: string): string {
	return `${code}${token}${FG.reset}`;
}

// Rendered lines contain CSI cursor/style sequences and an APC cursor marker.
// Keep those sequences intact; styling a digit inside one would corrupt terminal
// output. A token split by the cursor simply stays partly uncolored for that
// frame, then fully colors again when the cursor moves away.
const TERMINAL_SEQUENCE = /\x1b(?:\[[0-?]*[ -/]*[@-~]|\][\s\S]*?(?:\x07|\x1b\\)|_[\s\S]*?\x1b\\)/g;

function mapVisibleText(line: string, transform: (text: string) => string): string {
	let result = "";
	let cursor = 0;
	for (const match of line.matchAll(TERMINAL_SEQUENCE)) {
		result += transform(line.slice(cursor, match.index));
		result += match[0];
		cursor = (match.index ?? 0) + match[0].length;
	}
	return result + transform(line.slice(cursor));
}

function highlightCodeLine(line: string, language: Language): string {
	const tokenPattern =
		language === "typescript" ? TYPESCRIPT_TOKEN : language === "json" ? JSON_TOKEN : BASH_TOKEN;

	return mapVisibleText(line, (text) =>
		text.replace(tokenPattern, (token) => {
			if (language === "typescript") {
				if (token.startsWith("//") || token.startsWith("/*")) return color(token, FG.comment);
				if (/^["'`]/.test(token)) return color(token, FG.string);
				if (/^\d/.test(token)) return color(token, FG.number);
				if (/^(any|bigint|boolean|never|number|object|string|symbol|unknown|undefined|void)$/.test(token))
					return color(token, FG.type);
				return color(token, FG.keyword);
			}
			if (language === "json") {
				if (/^["']/.test(token)) return color(token, FG.string);
				if (/^(true|false|null)$/.test(token)) return color(token, FG.keyword);
				return color(token, FG.number);
			}
			if (token.startsWith("#")) return color(token, FG.comment);
			if (/^["']/.test(token)) return color(token, FG.string);
			if (token.startsWith("$")) return color(token, FG.variable);
			if (/^\d/.test(token)) return color(token, FG.number);
			return color(token, FG.keyword);
		}),
	);
}

function highlightMarkdownLine(line: string): string {
	return mapVisibleText(line, (text) => text.replace(/`[^`]+`/g, (token) => color(token, FG.inlineCode)));
}

class ComposerHighlightEditor extends CustomEditor {
	render(width: number): string[] {
		const sourceLines = classifyFencedLines(this.getText());
		const padding = this.getPaddingX();

		return super.render(width).map((rendered) => {
			const plain = stripTerminalSequences(rendered);
			const content = plain.slice(padding).trimEnd();
			if (!content) return rendered;

			const matchingLines = sourceLines.filter((source) => source.text.includes(content));
			const languages = new Set(matchingLines.map((source) => source.language).filter(Boolean));
			const isFence = matchingLines.some((source) => source.fence && source.text === content);

			if (isFence) return rendered.replace(content, color(content, FG.fence));
			if (languages.size === 1 && matchingLines.every((source) => source.language)) {
				return highlightCodeLine(rendered, [...languages][0]!);
			}
			return highlightMarkdownLine(rendered);
		});
	}
}

export default function (pi: ExtensionAPI) {
	pi.on("session_start", (_event, ctx) => {
		if (!ctx.hasUI) return;
		ctx.ui.setEditorComponent((tui, theme, keybindings) =>
			new ComposerHighlightEditor(tui, theme, keybindings),
		);
	});
}
