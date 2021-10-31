import { ulid } from "ulid";

export const getScanItemPk = () => "ScanItem";
export const getScanItemKey = () => [getScanItemPk(), ulid()];

export const getUserScanStatusKey = userId => `UserScanStatus#${userId}`;

export const getCurrentLookupPk = () => "BookLookup";
export const getCurrentLookupSk = idx => `BookLookup#${idx}`;
export const getCurrentLookupFullKey = idx => ["BookLookup", getCurrentLookupSk(idx)];

export const getScanResultKey = (userId): [string, string, number] => [
  `User#${userId}#ScanResult`,
  ulid(),
  Math.round(+new Date() / 1000) + 60 * 60 * 24 * 7 // 1 week
];
