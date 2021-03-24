import { getDefaultClient } from "micro-graphql-svelte";
let graphqlClient = getDefaultClient();

export const syncUpdates = (cacheName, newResults, resultSet, arrName, options: any = {}) => {
  const cache = graphqlClient.getCache(cacheName);

  [...cache.entries].forEach(([uri, currentResults]) => {
    if (!(currentResults instanceof Promise)) {
      currentResults.data[resultSet][arrName] = syncCollection(currentResults.data[resultSet][arrName], newResults, options);
    }
  });
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

export const syncDeletes = (cacheName, _ids, resultSet, arrName, { sort } = {} as any) => {
  const cache = graphqlClient.getCache(cacheName);
  const deletedMap = new Set(_ids);

  [...cache.entries].forEach(([uri, currentResults]) => {
    if (!(currentResults instanceof Promise)) {
      let res = currentResults.data[resultSet];
      res[arrName] = res[arrName].filter(o => !deletedMap.has(o._id));
      sort && res[arrName].sort(sort);
    }
  });
};

export const clearCache = (...cacheNames) => {
  cacheNames.forEach(name => {
    let cache = graphqlClient.getCache(name);
    cache && cache.clearCache();
  });
};
