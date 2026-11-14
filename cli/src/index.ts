#!/usr/bin/env node
import { setup } from './commands/setup.ts';
const [command, ...args] = process.argv.slice(2);
try {
  if (command === 'setup') await setup(args);
  else if (!command || command === '--help') console.log('Agentic Engineering\nUsage: ae setup [--dry-run]\nRun from checkout: npm --prefix cli run setup -- --help');
  else throw new Error(`Unknown command: ${command}. Only setup is implemented.`);
} catch (error) {
  console.error(`Setup stopped: ${(error as Error).message}`);
  process.exitCode = 1;
}
