import fs from "node:fs/promises";
import path from "node:path";

import { app } from "electron";
import { Mutex } from "./mutex";

interface Config {
  window?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    maximized?: boolean;
  };
  homeAddress?: string;
}

const DEFAULT_WINDOW_X: number | null = null;
const DEFAULT_WINDOW_Y: number | null = null;
const DEFAULT_WINDOW_WIDTH = 800;
const DEFAULT_WINDOW_HEIGHT = 600;
const DEFAULT_WINDOW_MAXIMIZED = false;
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
    // TODO: update fields recursively.
    await fs.writeFile(filePath, JSON.stringify(config, null, 2));
  });
}

export async function getHomeAddress(): Promise<string> {
  return (await readConfig()).homeAddress || DEFAULT_HOME_ADDRESS;
}

export async function saveHomeAddress(homeAddress: string): Promise<void> {
  await updateConfig({ homeAddress });
}

export async function isWindowMaximized(): Promise<boolean> {
  return (await readConfig()).window?.maximized ?? DEFAULT_WINDOW_MAXIMIZED;
}

export async function saveWindowMaximized(maximized: boolean): Promise<void> {
  await updateConfig({ window: { maximized } });
}

export async function getWindowPosition(): Promise<{
  x: number | null;
  y: number | null;
}> {
  const window = (await readConfig()).window;
  return {
    x: window?.x ?? DEFAULT_WINDOW_X,
    y: window?.y ?? DEFAULT_WINDOW_Y,
  };
}

export async function saveWindowPosition(x: number, y: number): Promise<void> {
  await updateConfig({ window: { x, y } });
}

export async function getWindowSize(): Promise<{
  width: number;
  height: number;
}> {
  const window = (await readConfig()).window;
  return {
    width: window?.width ?? DEFAULT_WINDOW_WIDTH,
    height: window?.height ?? DEFAULT_WINDOW_HEIGHT,
  };
}

export async function saveWindowSize(
  width: number,
  height: number,
): Promise<void> {
  await updateConfig({ window: { width, height } });
}
