#!/usr/bin/env node
import { setup } from './commands/setup.ts';
import { project } from './commands/project.ts';
const [command, ...args] = process.argv.slice(2);
try {
  if (command === 'setup') await setup(args);
  else if (command === 'project') await project(args);
  else if (!command || command === '--help') console.log('Agentic Engineering\nUsage: ae setup [--dry-run]\n       ae project list|inspect|plan|apply|verify (see: ae project --help)\nRun from checkout: npm --prefix cli run setup -- --help');
  else throw new Error(`Unknown command: ${command}. Only setup and project are implemented.`);
} catch (error) {
  console.error(`${command === 'project' ? 'Project stopped' : 'Setup stopped'}: ${(error as Error).message}`);
  process.exitCode = 1;
}
