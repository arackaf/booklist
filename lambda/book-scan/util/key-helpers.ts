import { ulid } from "ulid";

export const getScanItemKey = () => [`ScanItem`, ulid()];

export const getUserScanStatusKey = userId => `UserScanStatus#${userId}`;

export const getCurrentLookupPk = () => "BookLookup";
export const getCurrentLookupSk = idx => `BookLookup#${idx}`;
export const getCurrentLookupFullKey = idx => ["BookLookup", getCurrentLookupSk(idx)];
