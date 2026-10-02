import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

type HomeyConfig = {
  baseUrl: string;
  integrationKey: string;
};

function getConfigPath(): string {
  if (process.env.LOGI_HOMEY_CONFIG) {
    return process.env.LOGI_HOMEY_CONFIG;
  }

  const configRoot = process.env.APPDATA
    ?? process.env.XDG_CONFIG_HOME
    ?? join(homedir(), 'Library', 'Application Support');

  return join(configRoot, 'LogiHomey', 'config.json');
}

async function loadConfig(): Promise<HomeyConfig> {
  const configPath = getConfigPath();
  let config: Partial<HomeyConfig>;

  try {
    config = JSON.parse(await readFile(configPath, 'utf8')) as Partial<HomeyConfig>;
  } catch (error) {
    throw new Error(`Unable to read ${configPath}: ${(error as Error).message}`);
  }

  if (typeof config.baseUrl !== 'string' || typeof config.integrationKey !== 'string') {
    throw new Error(`The configuration at ${configPath} must contain baseUrl and integrationKey`);
  }

  const baseUrl = new URL(config.baseUrl);
  if (!['http:', 'https:'].includes(baseUrl.protocol) || baseUrl.username || baseUrl.password) {
    throw new Error('baseUrl must be an HTTP or HTTPS Homey address without credentials');
  }

  if (config.integrationKey.length < 32) {
    throw new Error('integrationKey must contain at least 32 characters');
  }

  return {
    baseUrl: baseUrl.toString().replace(/\/$/, ''),
    integrationKey: config.integrationKey,
  };
}

export async function getConfiguredBaseUrl(): Promise<string> {
  return (await loadConfig()).baseUrl;
}

export async function sendButtonPress(buttonNumber: number): Promise<void> {
  try {
    const config = await loadConfig();
    const endpoint = `${config.baseUrl}/api/app/com.homey.logitechmx/button-press`;
    console.info(`[Logi Homey Actions] Sending key ${buttonNumber} to ${config.baseUrl}.`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ integrationKey: config.integrationKey, buttonNumber }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Homey returned HTTP ${response.status}`);
    }

    console.info(`[Logi Homey Actions] Homey accepted key ${buttonNumber} (HTTP ${response.status}).`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Logi Homey Actions] Failed to send key ${buttonNumber}: ${message}`);
    throw error;
  }
}