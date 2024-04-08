import type { Readable } from "svelte/store";

export type Login = {
  name: string;
  email: string;
  image: string;
  provider: string;
};

export type UnwrapReadable<T> = T extends Readable<infer U> ? U : never;
