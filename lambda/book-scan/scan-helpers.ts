import { ulid } from "ulid";

export const getScanItemKey = () => [`ScanItem`, ulid()];

export const getUserScanStatusKey = userId => `UserScanStatus#${userId}`;
