import dotenv from "dotenv";

const envVarSource = process.env.NODE_ENV === "production" && false ? process.env : dotenv.config().parsed;

export const dotEnvReplacement = () => {
  const replacements = Object.entries(envVarSource).reduce((obj, [key, val]) => {
    obj[`process.env.${key}`] = `"${val}"`;
    return obj;
  }, {});

  return {
    name: "dotenv-replacement",
    config(obj) {
      obj.define = obj.define || {};
      Object.assign(obj.define, replacements);
    }
  };
};
