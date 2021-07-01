import fs from "fs/promises";
import { pipeline } from "stream/promises";
import fetch from "node-fetch";
import tar from "tar";
import chalk from "chalk";

const DOWNLOAD_INFO = {
  rust: {
    org: "near",
    repo: "near-sdk-rs",
    branch: "master",
    folder: "examples",
  },
  assemblyScript: {
    org: "near",
    repo: "near/near-sdk-as",
    branch: "master",
    folder: "examples",
  },
  app: {
    org: "mehtaphysical",
    repo: "near-js",
    branch: "main",
    folder: "examples",
  },
};

interface DownloadInfo {
  org: string;
  repo: string;
  branch: string;
  folder: string;
}

interface DownloadOptions {
  root: string;
  templateName: string;
}

const downloadExample = async ({
  root,
  templateName,
  downloadInfo,
}: DownloadOptions & { downloadInfo: DownloadInfo }) => {
  console.log(
    chalk.green(
      `Downloading example template (${templateName}) from ${downloadInfo.org}/${downloadInfo.repo}`
    )
  );
  await fs.mkdir(root, { recursive: true });
  const res = await fetch(
    `https://codeload.github.com/${downloadInfo.org}/${downloadInfo.repo}/tar.gz/${downloadInfo.branch}`,
    {}
  );
  await pipeline(
    res.body,
    tar.extract({ cwd: root, strip: 2 + templateName.split("/").length }, [
      `${downloadInfo.repo}-${downloadInfo.branch}/${downloadInfo.folder}/${templateName}`,
    ])
  );
};

const getRustVersion = async () => {
  const res = await fetch(
    "https://api.github.com/repos/near/near-sdk-rs/releases"
  );
  const [latestRelease] = await res.json();
  return latestRelease.name.slice(1);
};

const applyRustSkdVersion = async (root: string) => {
  const version = await getRustVersion();
  await fs.writeFile(
    `${root}/Cargo.toml`,
    (
      await fs.readFile(`${root}/Cargo.toml`, "utf-8")
    ).replace(/near-sdk = .*\n/, `near-sdk = "${version}"\n`)
  );
  await fs.writeFile(
    `${root}/Cargo.toml`,
    (
      await fs.readFile(`${root}/Cargo.toml`, "utf-8")
    ).replace(
      /near-contract-standards = .*\n/,
      `near-contract-standards = "${version}"\n`
    )
  );
};

export const downloadRustExample = async ({
  root,
  templateName,
}: DownloadOptions) => {
  await downloadExample({
    root,
    templateName,
    downloadInfo: DOWNLOAD_INFO.rust,
  });
  await applyRustSkdVersion(root);
};

export const downloadAssemblyScriptExample = async (
  _options: DownloadOptions
) => {
  throw new Error("AssemblyScript examples not supported yet");
};

export const downloadAppExample = async ({
  root,
  templateName,
}: DownloadOptions) => {
  await downloadExample({
    root,
    templateName,
    downloadInfo: DOWNLOAD_INFO.app,
  });
};
