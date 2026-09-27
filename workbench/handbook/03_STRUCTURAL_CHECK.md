# 🩺 Structural check

The one executable check this package has. Read-only: asserts every internal Markdown link resolves inside the folder, and parses any JSON the package grows. The package is currently all Markdown, so the JSON half passes vacuously -- that is expected, not a pass worth reporting. Run it from the package root after any move, rename or split -- that is exactly when links break silently.

```bash
python3 - <<'EOF'
from pathlib import Path
import json, re
root = Path('.').resolve()
# Payload directories: their files are INSTALLED somewhere else, so their links resolve
# against that destination and not against this root. Checking them here reports a
# permanent failure, and a check that always fails is a check nobody runs.
payload = ('config/claude', 'templates/claude_home')
def carried(p):
    rel = p.relative_to(root).as_posix()
    return any(rel.startswith(d + '/') for d in payload)
# All three local folders are skipped, not just .memory/. They are never committed and
# they legitimately point outside the package -- a note about another repository is
# supposed to link to that repository.
local = {'.memory', '.profile', '.workgroup', '.git'}
files = sorted(p for p in root.rglob('*')
               if p.is_file() and p.suffix in {'.md', '.json'} and not local & set(p.parts))
links = 0
for f in files:
    text = f.read_text()
    if f.suffix == '.json':
        json.loads(text)
    elif not carried(f):
        for dest in re.findall(r'\]\(([^)#\s]+)', text):
            if dest.startswith(('http', 'mailto', '~', '__')):
                continue
            target = (f.parent / dest).resolve()
            assert target.is_relative_to(root) and target.exists(), (str(f), dest)
            links += 1
print('PASS:', len(files), 'files; JSON parses;', links, 'internal links resolve')
EOF
```

It validates structure only -- nothing about schemas, runtime safety, prompt quality or real delivery. A pass here is not evidence the package is correct, only that it is not broken in the one way a refactor reliably breaks it.

**Two directories are exempt, and the exemption is a real hole rather than a tidy-up.** `config/claude/` and `templates/claude_home/` hold files that are *carried* to a harness configuration directory and only make sense once installed there -- their links point at sibling skills and at an operator's state repository, neither of which exists at this root. So nothing checks those links, and a broken one inside a payload directory is found by installing it, not by running this. If a payload grows to the point where that matters, the fix is a second check run from the destination, not a relaxation of this one.
