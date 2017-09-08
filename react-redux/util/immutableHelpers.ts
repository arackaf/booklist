export const bulkMerge = (_ids: string[], $merge) => _ids.reduce((hash, _id) => ((hash[_id] = { $merge }), hash), {});
