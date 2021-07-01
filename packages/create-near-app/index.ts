#!/usr/bin/env node

import { Command } from "commander";
import { ProgramOptions, exec } from "./utils/program";



const program = new Command("create-near-app");

program
  .option(
    "-t, --template <name>",
    "template to use to create the project",
    "status-message"
  )
  .option("-c, --contract-template <name>", "smart contract template")
  .option("-a, --app-template <name>", "front-end app template")
  .argument("<folder>", "folder to create")
  .parse();

const options = program.opts();
exec({ ...options, folder: program.args[0] } as ProgramOptions);
