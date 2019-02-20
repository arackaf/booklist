export const syncUpdates = (cache, newResults, resultSet, arrName) => {
  const lookupNew = new Map(newResults.map(o => [o._id, o]));

  [...cache.entries].forEach(([uri, currentResults]) => {
    currentResults.data[resultSet][arrName].forEach(o => {
      if (lookupNew.has(o._id)) {
        Object.assign(o, lookupNew.get(o._id));
      }
    });
    const existingLookup = new Set(currentResults.data[resultSet][arrName].map(o => o._id));
    currentResults.data[resultSet][arrName].push(...newResults.filter(o => !existingLookup.has(o._id)));
  });
};

export const syncDeletes = (cache, _ids, resultSet, arrName) => {
  const deletedMap = new Set(_ids);

  [...cache.entries].forEach(([uri, currentResults]) => {
    let res = currentResults.data[resultSet];
    res[arrName] = res[arrName].filter(o => !deletedMap.has(o._id));
  });
};
