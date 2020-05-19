import { getDefaultClient } from "micro-graphql-react";
let graphqlClient = getDefaultClient();

export const syncUpdates = (cacheName, newResults, resultSet, arrName, options: any = {}) => {
  const cache = graphqlClient.getCache(cacheName);

  [...cache.entries].forEach(([uri, currentResults]) => syncResults(currentResults.data[resultSet], arrName, newResults, options));

  if (options.force) {
    graphqlClient.forceUpdate(cacheName);
  }
};

export const syncResults = (resultSet, arrName, newResults, options = {}) => {
  if (!Array.isArray(newResults)) {
    newResults = [newResults];
  }

  resultSet[arrName] = syncCollection(resultSet[arrName], newResults, options);
};

export const syncCollection = (results, newResults, { sort } = {} as any) => {
  results = results.concat();
  const lookupNew = new Map(newResults.map(o => [o._id, o]));
  results.forEach((o, index) => {
    if (lookupNew.has(o._id)) {
      results[index] = Object.assign({}, o, lookupNew.get(o._id));
    }
  });
  const existingLookup = new Set(results.map(o => o._id));
  results.push(...newResults.filter(o => !existingLookup.has(o._id)));
  return sort ? results.sort(sort) : results;
};

export const standardDelete = (type, cacheName, _ids, options = {} as any) => {
  syncDeletes(cacheName, _ids, `all${type}s`, `${type}s`, options);
};

export const syncDeletes = (cacheName, _ids, resultSet, arrName, { sort, onDelete } = {} as any) => {
  const cache = graphqlClient.getCache(cacheName);
  const deletedMap = new Set(_ids);

  [...cache.entries].forEach(([uri, currentResults]) => {
    let res = currentResults.data[resultSet];
    let oldCount = res[arrName].length;
    res[arrName] = res[arrName].filter(o => !deletedMap.has(o._id));
    let deletedCount = oldCount - res[arrName].length;
    if (deletedCount && onDelete) {
      onDelete({ count: deletedCount, resultSet: currentResults.data });
    }

    sort && res[arrName].sort(sort);
  });
};

export const clearCache = (...cacheNames) => {
  cacheNames.forEach(name => {
    let cache = graphqlClient.getCache(name);
    cache && cache.clearCache();
  });
};
