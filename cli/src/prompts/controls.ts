import { Prompt, SelectPrompt, MultiSelectPrompt, ConfirmPrompt, getColumns, getRows } from '@clack/core';
import type { Action, Component, Selection, State } from '../setup/types.ts';
import { actionLabel, cycleAction, glyph, setAction, statusLabel } from './choices.ts';

export const BACK = Symbol('setup:back');
const backspace = (name?: string, sequence?: string) => name === 'backspace' || sequence === '\x7f' || sequence === '\b';
const fit = (text: string, width: number) => Array.from(text.replace(/[\x00-\x1f\x7f]/g, ' ')).slice(0, Math.max(1, width - 1)).join('');
function backOnKey(prompt: SelectPrompt<any> | MultiSelectPrompt<any> | ConfirmPrompt, onBack: () => void) {
  prompt.on('key', (_char, key) => { if (backspace(key.name, key.sequence)) { onBack(); prompt.state = 'submit'; } });
}
export async function navigationSelect<T extends string>(opts: {
  message: string; initialValue?: T; options: { value: T; label: string; hint?: string }[];
}): Promise<T | typeof BACK | symbol> {
  let back = false;
  const prompt = new SelectPrompt({ ...opts, render() {
    if (this.state === 'cancel') return '└ Cancelled';
    if (this.state === 'submit') return `◇ ${opts.message}\n│ ${back ? 'Back' : this.options[this.cursor].label}`;
    const rows = Math.max(3, Math.min(8, getRows(process.stdout) - 7));
    const start = Math.max(0, Math.min(this.cursor - Math.floor(rows / 2), opts.options.length - rows));
    return [`◆ ${opts.message}`, ...this.options.slice(start, start + rows).map((o, i) => `│ ${start + i === this.cursor ? '●' : '○'} ${o.label}`),
      `│ ${this.options[this.cursor].hint ?? ''}`, '└ ↑/↓ choose · Enter continue · Backspace back · Esc/Ctrl+C cancel'].join('\n');
  } });
  backOnKey(prompt, () => { back = true; });
  const result = await prompt.prompt();
  return back ? BACK : result!;
}
export async function navigationMultiselect(opts: {
  message: string; initialValues?: string[]; options: { value: string; label: string; hint?: string }[];
}): Promise<string[] | typeof BACK | symbol> {
  let back = false;
  const prompt = new MultiSelectPrompt({ ...opts, required: false, render() {
    if (this.state === 'cancel') return '└ Cancelled';
    if (this.state === 'submit') return `◇ ${opts.message}\n│ ${back ? 'Back' : `${this.value?.length ?? 0} selected`}`;
    const rows = Math.max(3, Math.min(8, getRows(process.stdout) - 7));
    const start = Math.max(0, Math.min(this.cursor - Math.floor(rows / 2), this.options.length - rows));
    return [`◆ ${opts.message}`, ...this.options.slice(start, start + rows).map((o, i) => `│ ${i + start === this.cursor ? '›' : ' '} ${this.value?.includes(o.value) ? '[x]' : '[ ]'} ${o.label}`),
      '└ Space toggle · Enter continue · Backspace back · Esc/Ctrl+C cancel'].join('\n');
  } });
  backOnKey(prompt, () => { back = true; });
  const result = await prompt.prompt(); return back ? BACK : result!;
}
export async function navigationConfirm(message: string): Promise<boolean | typeof BACK | symbol> {
  let back = false;
  const prompt = new ConfirmPrompt({ active: 'Yes', inactive: 'No', initialValue: false, render() {
    if (this.state === 'cancel') return '└ Cancelled';
    if (this.state === 'submit') return `◇ ${message}\n│ ${back ? 'Back' : this.value ? 'Yes' : 'No'}`;
    return `◆ ${message}\n│ ${this.value ? '● Yes / ○ No' : '○ Yes / ● No'}\n└ ←/→ choose · Enter confirm · Backspace back · Esc/Ctrl+C cancel`;
  } });
  backOnKey(prompt, () => { back = true; });
  const result = await prompt.prompt(); return back ? BACK : result!;
}
export type ComponentChoices = { direction: 'next' | 'back'; selections: Record<string, Selection>; cursor: number; touched: string[] };
export async function componentChoices(components: Component[], states: Record<string, State>, initial: Record<string, Selection>, cursor = 0): Promise<ComponentChoices | symbol> {
  let index = Math.max(0, Math.min(cursor, components.length - 1));
  const selections = structuredClone(initial);
  const touched = new Set<string>();
  const prompt = new Prompt<ComponentChoices>({ render() {
    const count = Object.values(selections).filter(v => v.action !== 'keep').length;
    if (this.state === 'cancel') return '└ Cancelled';
    if (this.state === 'submit') return `◇ Component choices\n│ ${count} selected · ${this.value?.direction === 'back' ? 'Back (choices preserved)' : 'Continue'}`;
    const rows = Math.max(3, Math.min(15, getRows(process.stdout) - 14));
    const start = Math.max(0, Math.min(index - Math.floor(rows / 2), components.length - rows));
    const focused = components[index]; const observed = states[focused.id];
    const width = Math.max(30, getColumns(process.stdout) - 2);
    const lines = [
      '◆ Component choices — profile recommendations preselected; edit directly',
      ...components.slice(start, start + rows).map((c, i) => `│ ${fit(`${start + i === index ? '›' : ' '} ${glyph(selections[c.id])} ${c.name} — ${actionLabel(c, states[c.id], selections[c.id])} | ${statusLabel(c, states[c.id])}`, width)}`),
      `│ ${index + 1}/${components.length} · ${count} selected · [x] install/update · [−] remove · [ ] no change`,
      `│ ${fit(`${focused.id}: ${statusLabel(focused, observed)}`, width)}`,
      ...observed.evidence.slice(0, observed.status === 'migration' || observed.status === 'conflict' ? 3 : 1).map(v => `│ ${fit(v, width)}`),
      '│ ↑/↓ move · Space cycle · x install/update · - remove (guided) · 0 no change',
      '└ Enter review / guided removal · Backspace profile · Esc/Ctrl+C cancel',
    ];
    return lines.join('\n');
  } }, false);
  prompt.value = { direction: 'next', selections, cursor: index, touched: [] };
  prompt.on('cursor', key => {
    if (key === 'up') index = (index + components.length - 1) % components.length;
    if (key === 'down') index = (index + 1) % components.length;
    if (key === 'space') { cycleAction(selections, components[index].id); touched.add(components[index].id); }
    prompt.value!.touched = [...touched];
    prompt.value!.cursor = index;
  });
  prompt.on('key', (char, key) => {
    if (backspace(key.name, key.sequence)) { prompt.value!.direction = 'back'; prompt.state = 'submit'; return; }
    const actions: Record<string, Action> = { x: 'install', '-': 'remove', r: 'remove', '0': 'keep' };
    if (char && actions[char]) {
      setAction(selections, components[index].id, actions[char]); touched.add(components[index].id);
      prompt.value!.touched = [...touched];
    }
  });
  return (await prompt.prompt())!;
}
