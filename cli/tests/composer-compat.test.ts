// Compatibility evidence: unmodified composer source vs the INSTALLED native Pi runtime.
// Loads through Pi's own extension loader (jiti + its built-in aliases); no extra module mapping,
// no model/session/settings APIs, no HOME access (only a temporary cwd). Read-only use of the release.
// This is host-runtime test evidence, not visual terminal acceptance.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const composer = path.join(root, 'harness/pi/packages/composer/.pi/agent/extensions/composer-highlight.ts');
const release = process.env.AE_PI_RELEASE ?? path.join(os.homedir(), '.pi/agent/install/releases/1.5.2');
const scope = path.join(release, 'node_modules/@earendil-works');
const present = fs.existsSync(path.join(scope, 'pi-coding-agent/dist/index.js')) && fs.existsSync(path.join(scope, 'pi-tui/dist/index.js'));
const skip = present ? false : `Pi release not found at ${release}; set AE_PI_RELEASE`;
const imp = (p: string) => import(pathToFileURL(path.join(scope, p)).href);

async function runtime() {
  const [loader, kb, app, tui] = await Promise.all([
    imp('pi-coding-agent/dist/core/extensions/loader.js'), imp('pi-coding-agent/dist/core/keybindings.js'),
    imp('pi-coding-agent/dist/index.js'), imp('pi-tui/dist/index.js')]);
  const pkg = JSON.parse(fs.readFileSync(path.join(scope, 'pi-coding-agent/package.json'), 'utf8'));
  return { loadExtensions: loader.loadExtensions, KeybindingsManager: kb.KeybindingsManager, CustomEditor: app.CustomEditor, tui, version: pkg.version as string };
}
const theme = { borderColor: (s: string) => s, selectList: Object.fromEntries(['selectedPrefix', 'selectedText', 'description', 'scrollInfo', 'noMatch'].map(k => [k, (s: string) => s])) };
const fakeTui = { requestRender() {}, terminal: { rows: 40, columns: 80 } };
function tmp(t: any) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ae-composer-compat-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true })); return dir;
}
async function load(t: any, rt: Awaited<ReturnType<typeof runtime>>, hasUI = true) {
  const res = await rt.loadExtensions([composer], tmp(t));
  assert.deepEqual(res.errors, []); assert.equal(res.extensions.length, 1);
  const factories: any[] = [];
  const ctx = { hasUI, ui: { setEditorComponent: (f: any) => factories.push(f) } };
  for (const h of res.extensions[0].handlers.get('session_start') ?? []) await h({ type: 'session_start' }, ctx);
  return { res, factories };
}
const SAMPLES: Record<string, string> = {
  markdown: 'Plain `inline` text and **bold**\n- item with `code`',
  typescript: '```ts\nconst a: number = 1; // note "x" `y`\ninterface T { b: string }\n```',
  json: '```json\n{"k": [true, null, -1.5e3], "s": "v"}\n```',
  bash: '```bash\nif [ "$X" = 1 ]; then echo $X \'hi\' # c\nfi\n```',
  tilde_fence_unknown_lang: '~~~rust\nlet x = 1;\n~~~\n```\nplain\n```',
  unicode: '```ts\nconst s = "你好🙂 é"; // 世界\n```\n日本語 `コード` 🙂🙂',
  long_unbroken: '```ts\nconst aVeryLongIdentifierWithoutBreaks_0123456789 = "超長い文字列🙂🙂🙂🙂";\n```',
};
const WIDTHS = [80, 40, 20, 12, 8, 5];

test('native Pi loads unmodified composer with no module mapping; registers editor on session_start only with UI', { skip }, async t => {
  const rt = await runtime();
  assert.equal(rt.version, '1.5.2', 'accepted runtime version');
  const { res, factories } = await load(t, rt);
  assert.deepEqual(res.warnings, []);
  assert.deepEqual([...res.extensions[0].handlers.keys()], ['session_start']);
  assert.equal(factories.length, 1);
  const editor = factories[0](fakeTui, theme, new rt.KeybindingsManager({}));
  assert.ok(editor instanceof rt.CustomEditor, 'real CustomEditor subclass from the same module instance');
  assert.equal(editor.constructor.name, 'ComposerHighlightEditor');
  assert.equal((await load(t, rt, false)).factories.length, 0, 'headless context registers nothing');
});

for (const [name, text] of Object.entries(SAMPLES)) for (const width of WIDTHS) {
  test(`renderer parity vs native CustomEditor: ${name} @${width}`, { skip }, async t => {
    const rt = await runtime(); const { visibleWidth, stripTerminalSequences } = rt.tui;
    const { factories } = await load(t, rt);
    const kbm = new rt.KeybindingsManager({});
    const custom = factories[0](fakeTui, theme, kbm); const native = new rt.CustomEditor(fakeTui, theme, kbm);
    custom.focused = native.focused = true; custom.setText(text); native.setText(text);
    const a: string[] = custom.render(width); const b: string[] = native.render(width);
    assert.equal(a.length, b.length, 'same line count');
    a.forEach((line, i) => {
      assert.equal(stripTerminalSequences(line), stripTerminalSequences(b[i]), `visible text line ${i}`);
      assert.equal(visibleWidth(line), visibleWidth(b[i]), `visible width line ${i}`);
      assert.ok(visibleWidth(line) <= width, `line ${i} within width`);
      assert.equal(line.includes(rt.tui.CURSOR_MARKER), b[i].includes(rt.tui.CURSOR_MARKER), `cursor marker line ${i}`);
    });
  });
}

test('highlighting is actually applied (guards against vacuous parity) and leaves non-code prose uncolored', { skip }, async t => {
  const rt = await runtime(); const { factories } = await load(t, rt);
  const editor = factories[0](fakeTui, theme, new rt.KeybindingsManager({}));
  const render = (text: string) => { editor.setText(text); return editor.render(80).join('\n'); };
  assert.match(render(SAMPLES.typescript), /\x1b\[38;5;141mconst\x1b\[39m/);
  assert.match(render(SAMPLES.json), /\x1b\[38;5;114m"k"\x1b\[39m/);
  const bash = render(SAMPLES.bash);
  assert.match(bash, /\x1b\[38;5;114m"\$X"\x1b\[39m/, 'quoted $X is one string token');
  assert.match(bash, /\x1b\[38;5;215m\$X\x1b\[39m/, 'unquoted $X is a variable token');
  assert.match(render(SAMPLES.markdown), /\x1b\[38;5;110m`inline`\x1b\[39m/);
  assert.doesNotMatch(render('plain words only'), /\x1b\[38;5;/);
});

test('native submission and editing behavior are inherited unchanged', { skip }, async t => {
  const rt = await runtime(); const { factories } = await load(t, rt);
  const kbm = new rt.KeybindingsManager({});
  const custom = factories[0](fakeTui, theme, kbm); const native = new rt.CustomEditor(fakeTui, theme, kbm);
  const submitted: Record<string, string[]> = { custom: [], native: [] };
  custom.onSubmit = (v: string) => submitted.custom.push(v); native.onSubmit = (v: string) => submitted.native.push(v);
  const text = '```ts\nconst a = 1;\n```\n你好🙂';
  for (const e of [custom, native]) { e.setText(text); e.handleInput('\r'); e.handleInput('x'); e.handleInput('\r'); }
  assert.deepEqual(submitted.custom, submitted.native);
  assert.equal(submitted.custom[0], text, 'submitted text is the raw prompt, with no ANSI colors');
  assert.ok(!submitted.custom.join('').includes('\x1b'));
  assert.equal(custom.getText(), native.getText());
  custom.disableSubmit = true; submitted.custom.length = 0; custom.setText('blocked'); custom.handleInput('\r');
  assert.deepEqual(submitted.custom, [], 'disableSubmit honored');
});
