import { ulid } from "ulid";

export const getScanItemPk = () => "ScanItem";

export const getUserScanStatusKey = userId => `UserScanStatus#${userId}`;

export const getScanResultKey = (userId): [string, string, number] => [
  `User#${userId}#ScanResult`,
  ulid(),
  Math.round(+new Date() / 1000) + 60 * 60 * 24 * 7 // 1 week
];
