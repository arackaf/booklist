import { ulid } from "ulid";

export const getScanItemPk = () => "ScanItem";
export const getScanItemKey = () => [getScanItemPk(), ulid()];

export const getUserScanStatusKey = userId => `UserScanStatus#${userId}`;

export const getCurrentLookupPk = () => "BookLookup";
export const getCurrentLookupSk = idx => `BookLookup#${idx}`;
export const getCurrentLookupFullKey = idx => ["BookLookup", getCurrentLookupSk(idx)];

export const getScanResultKey = userId => [`User#${userId}#ScanResult`, ulid()];
