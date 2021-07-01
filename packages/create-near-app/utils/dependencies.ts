import { execSync } from "child_process";
import chalk from "chalk";

const useYarn = (): boolean => {
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent && userAgent.startsWith("yarn")) return true;
  else {
    try {
      execSync("yarn --version");
      return true;
    } catch {
      return false;
    }
  }
};

export const installRustDependencies = (root: string) => {
  console.log(
    chalk.green("Installing Rust Smart Contract dependencies and building WASM")
  );
  execSync(
    "env 'RUSTFLAGS=-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release",
    {
      cwd: root,
      encoding: "utf-8",
    }
  );
};

export const installAssemblyScriptDependencies = (root: string) => {
  console.log(
    chalk.green(
      "Installing AssemblyScript Smart Contract dependencies and building WASM"
    )
  );
  const userAgent = useYarn() ? "yarn" : "npm";
  execSync(`${userAgent} install && npm run build`, {
    cwd: root,
    encoding: "utf-8",
  });
};

export const installAppDependencies = (root: string) => {
  console.log(chalk.green("Installing dApp dependencies"));
  const userAgent = useYarn() ? "yarn" : "npm";
  execSync(`${userAgent} install`, {
    cwd: root,
    encoding: "utf-8",
  });
};
