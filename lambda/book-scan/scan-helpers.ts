import { ulid } from "ulid";

export const getScanItemKey = () => [`ScanItem`, ulid()];
