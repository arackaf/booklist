declare const process: {
  env: Record<string, string>;
  exit: (code?: number) => never;
};
