import ajaxUtil from "./ajaxUtil";
import localStorageManager from "./localStorage";
import { getCookieLookup } from "./loginStatus";

let ws;
let open = false;
const handlerQueue = [];
const initialMessageQueue = [];

class ScanWebSocketManage {
  constructor() {
    ws = new WebSocket(process.env.SCAN_WS);

    ws.onopen = () => {
      open = true;
      console.log("IS OPEN");

      initialMessageQueue.forEach(packet => this.send(packet));
      initialMessageQueue.length = 0;
    };

    ws.onmessage = ({ data }) => {
      handlerQueue.forEach(handler => handler(data));
    };
  }
  addHandler(handler) {
    handlerQueue.push(handler);
  }
  send(packet) {
    if (open) {
      ws.send(JSON.stringify(packet));
    } else {
      initialMessageQueue.push(packet);
    }
  }

  close() {}
}

window.onbeforeunload = function () {
  if (!ws) {
    return;
  }
  ws.onclose = function () {}; // disable onclose handler first
  ws.close();
};

export const scanWebSocket = new ScanWebSocketManage();

export async function checkPendingCount() {
  const cookieHash = getCookieLookup();

  const pendingCountResult = await ajaxUtil.getWithCors(process.env.CHECK_SCAN_STATUS, {
    userId: cookieHash.userId,
    loginToken: cookieHash.loginToken
  });
  if (pendingCountResult?.pendingCount == null) {
    return;
  }

  const { pendingCount } = pendingCountResult;
  dispatchScanDataUpdate({ type: "pendingCountSet", pendingCount });
}

export function dispatchScanDataUpdate(packet) {
  window.dispatchEvent(new CustomEvent("ws-info", { detail: { ...packet } }));
}
