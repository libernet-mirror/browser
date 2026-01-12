import fs from "node:fs/promises";
import path from "node:path";

import { app } from "electron";
import { Mutex } from "./mutex";

interface Config {
  homeAddress?: string;
}

const DEFAULT_HOME_ADDRESS = "https://www.google.com/";

const configFileMutex = new Mutex();

function getConfigFilePath(): string {
  return path.join(app.getPath("userData"), "config.json");
}

async function readConfig(): Promise<Config> {
  const filePath = getConfigFilePath();
  try {
    return JSON.parse(
      await configFileMutex.locked(async () =>
        (await fs.readFile(filePath)).toString("utf-8"),
      ),
    );
  } catch (e) {
    console.error(e);
    return {};
  }
}

async function updateConfig(update: Config): Promise<void> {
  const filePath = getConfigFilePath();
  await configFileMutex.locked(async () => {
    let config: Config = {};
    try {
      config = JSON.parse((await fs.readFile(filePath)).toString("utf-8"));
    } catch (e) {
      console.error(e);
    }
    if (update.homeAddress) {
      config.homeAddress = update.homeAddress;
    }
    await fs.writeFile(filePath, JSON.stringify(config, null, 2));
  });
}

export async function getHomeAddress(): Promise<string> {
  return (await readConfig()).homeAddress || DEFAULT_HOME_ADDRESS;
}

export async function saveHomeAddress(homeAddress: string): Promise<void> {
  await updateConfig({ homeAddress });
}
