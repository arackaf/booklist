import { ajaxUtil } from "./ajaxUtil";
import { env } from "$env/dynamic/public";
const { PUBLIC_SCAN_WS } = env;

let ws: WebSocket;
let open = false;
const handlerQueue: ((arg: any) => void)[] = [];
const initialMessageQueue: any[] = [];

class ScanWebSocketManage {
  constructor() {
    ws = new WebSocket(PUBLIC_SCAN_WS);

    ws.onopen = () => {
      open = true;

      initialMessageQueue.forEach(packet => this.send(packet));
      initialMessageQueue.length = 0;
    };

    ws.onmessage = ({ data }) => {
      handlerQueue.forEach(handler => handler(data));
    };
  }
  addHandler(handler: (data: any) => void) {
    handlerQueue.push(handler);
  }
  send(packet: any) {
    if (open) {
      ws.send(JSON.stringify(packet));
    } else {
      initialMessageQueue.push(packet);
    }
  }

  close() {}
}

if (typeof window === "object") {
  window.onbeforeunload = function () {
    if (!ws) {
      return;
    }
    ws.onclose = function () {}; // disable onclose handler first
    ws.close();
  };
}

export const getScanWebSocket = () => new ScanWebSocketManage();
export type { ScanWebSocketManage };

export async function checkPendingCount() {
  const pendingCountResult = await ajaxUtil.post("/api/check-scan-status", {});
  if (pendingCountResult?.pendingCount == null) {
    return;
  }

  const { pendingCount } = pendingCountResult;
  dispatchScanDataUpdate({ type: "pendingCountSet", pendingCount });
}

export function dispatchScanDataUpdate(packet: any) {
  window.dispatchEvent(new CustomEvent("ws-info", { detail: { ...packet } }));
}
