import { downloadAppExample, downloadRustExample } from "./template";
import {
  installAppDependencies,
  installRustDependencies,
} from "./dependencies";

export interface ProgramOptions {
  template: string;
  contractTemplate?: string;
  appTemplate?: string;
  folder: string;
}

const getFolders = ({
  folder,
  contractTemplate,
  appTemplate,
}: {
  folder: string;
  contractTemplate?: string;
  appTemplate?: string;
}): { contractRoot: string | null; appRoot: string | null } => {
  const root = `./${folder}`;

  let contractRoot;
  if (!contractTemplate) contractRoot = null;
  else if (contractTemplate && !appTemplate) contractRoot = root;
  else contractRoot = `${root}/contract`;

  const appRoot = appTemplate ? root : null;

  return {
    contractRoot,
    appRoot,
  };
};

export const exec = async ({
  folder,
  contractTemplate,
  appTemplate,
  template,
}: ProgramOptions) => {
  if (!contractTemplate && !appTemplate) {
    contractTemplate = template;
    appTemplate = template;
  }

  const { contractRoot, appRoot } = getFolders({
    folder,
    contractTemplate,
    appTemplate,
  });

  if (contractRoot && contractTemplate) {
    await downloadRustExample({
      root: contractRoot,
      templateName: contractTemplate,
    });
    await installRustDependencies(contractRoot);
  }

  if (appRoot && appTemplate) {
    await downloadAppExample({ root: appRoot, templateName: appTemplate });
    await installAppDependencies(appRoot);
  }
};
