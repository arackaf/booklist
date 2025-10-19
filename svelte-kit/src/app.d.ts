// See https://kit.svelte.dev/docs/types#app for information about these interfaces and what to do when importing types

import type { ScanWebSocketManage } from "$lib/util/scanUtils";

declare module "@auth/core/types" {
  interface Session {
    userId: string;
    provider: string;
  }
}

declare global {
  interface Window {
    ws: ScanWebSocketManage;
  }
}
