import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import fs from 'fs';
import os from 'os';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
  return str;
}

export function setEnvValue(key: string, value: string) {
  // read file from hdd & split if from a line-break to a array
  const ENV_VARS = fs.readFileSync('./.env', 'utf8').split(os.EOL);

  const lineStr = ENV_VARS.find((line: string) => {
    // (?<!#\s*)   Negative lookbehind to avoid matching comments (lines that starts with #).
    //             There is a double slash in the RegExp constructor to escape it.
    // (?==)       Positive lookahead to check if there is an equal sign right after the key.
    //             This is to prevent matching keys prefixed with the key of the env var to update.
    const keyValRegex = new RegExp(`(?<!#\\s*)${key}(?==)`);

    return line.match(keyValRegex);
  });

  if (!lineStr) {
    // if it doesn't exist, add it instead
    ENV_VARS.push(`${key}=${value}`);
  } else {
    // find the env we want based on the key
    const targetIdx = ENV_VARS.indexOf(lineStr);

    // replace the key/value with the new value
    ENV_VARS.splice(targetIdx, 1, `${key}=${value}`);
  }

  // write everything back to the file system
  fs.writeFileSync('./.env', ENV_VARS.join(os.EOL));
}

// setEnvValue('VAR1', 'ENV_1_VAL');
