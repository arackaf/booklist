import { getDefaultClient } from "micro-graphql-react";
let graphqlClient = getDefaultClient();

export const syncUpdates = (cacheName, newResults, resultSet, arrName, options: any = {}) => {
  const cache = graphqlClient.getCache(cacheName);

  [...cache.entries].forEach(([uri, currentResults]) => syncResults(currentResults.data[resultSet], arrName, newResults, options));

  if (options.force) {
    graphqlClient.forceUpdate(cacheName);
  }
};

export const syncResults = (resultSet, arrName, newResults, { sort } = {} as any) => {
  const lookupNew = new Map(newResults.map(o => [o._id, o]));

  resultSet[arrName] = resultSet[arrName].concat();
  resultSet[arrName].forEach((o, index) => {
    if (lookupNew.has(o._id)) {
      resultSet[arrName][index] = Object.assign({}, o, lookupNew.get(o._id));
    }
  });
  const existingLookup = new Set(resultSet[arrName].map(o => o._id));
  resultSet[arrName].push(...newResults.filter(o => !existingLookup.has(o._id)));
  return sort ? resultSet[arrName].sort(sort) : resultSet[arrName];
};

export const syncDeletes = (cacheName, _ids, resultSet, arrName, { sort } = {} as any) => {
  const cache = graphqlClient.getCache(cacheName);
  const deletedMap = new Set(_ids);

  [...cache.entries].forEach(([uri, currentResults]) => {
    let res = currentResults.data[resultSet];
    res[arrName] = res[arrName].filter(o => !deletedMap.has(o._id));
    sort && res[arrName].sort(sort);
  });
};

export const clearCache = (...cacheNames) => {
  cacheNames.forEach(name => {
    let cache = graphqlClient.getCache(name);
    cache && cache.clearCache();
  });
};
