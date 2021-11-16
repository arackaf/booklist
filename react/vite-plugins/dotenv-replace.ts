import dotenv from "dotenv";

import { replaceCodePlugin } from "vite-plugin-replace";

const envVarSource = process.env.DEV ? dotenv.config().parsed : process.env;
export const dotEnvReplacement = () => {
  const replacements = Object.entries(envVarSource).reduce(
    (obj, [key, val]) => {
      obj.replacements.push({ from: `process.env.${key}`, to: `"${val}"` });
      return obj;
    },
    { replacements: [] }
  );

  return replaceCodePlugin(replacements);
};
