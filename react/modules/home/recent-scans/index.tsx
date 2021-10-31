import React, { FunctionComponent, useEffect, useState } from "react";
const { useTransition } = React as any;

import { Queries, QueryOf } from "graphql-typings";
import "./styles.scss";

import RecentScansQuery from "../../../graphQL/recent-scans/recentScans.graphql";
import { Button } from "app/components/ui/Button";
import { SuspenseImg } from "app/components/suspenseImage";
import { graphqlClient } from "util/graphql";

const RecentScans: FunctionComponent = () => {
  const [loading, startTransition] = useTransition();

  const [currentNextPageKeys, setCurrentNextPageKeys] = useState<any>([null]);
  const [nextNextPageKey, setNextNextPageKey] = useState<any>(null);

  const recentScans = currentNextPageKeys.flatMap(lastKey => {
    const result = graphqlClient.read<QueryOf<Queries["recentScanResults"]>>(RecentScansQuery, { lastKey });
    return result.data?.recentScanResults?.ScanResults ?? [];
  });
  const latestKey = currentNextPageKeys[currentNextPageKeys.length - 1];
  const latestKeyData = graphqlClient.read<QueryOf<Queries["recentScanResults"]>>(RecentScansQuery, { lastKey: latestKey });
  const newLastKey = latestKeyData.data?.recentScanResults?.LastEvaluatedKey;

  useEffect(() => {
    setNextNextPageKey(newLastKey);
  }, [newLastKey]);

  const loadNextScans = () => {
    startTransition(() => {
      setCurrentNextPageKeys(arr => arr.concat(nextNextPageKey));
    });
  };

  return (
    <div className="recent-scans-module">
      <div className="overlay-holder">
        <div className="results">
          {recentScans.map((item, i) => {
            return item.success ? <ScanDisplay key={i} item={item} /> : <ScanFailureDisplay item={item} key={i} />;
          })}
          {nextNextPageKey ? (
            <>
              <div></div>
              <Button preset="info" disabled={loading} onClick={loadNextScans}>
                Load More
              </Button>
            </>
          ) : (
            <NoMoreResults />
          )}
        </div>
      </div>
    </div>
  );
};

const ScanDisplay = ({ item }) => {
  return (
    <>
      <SuspenseImg src={item.smallImage} />
      <div>{item.title ?? `${item.isbn} Failure`}</div>
    </>
  );
};

const ScanFailureDisplay = ({ item }) => {
  return (
    <>
      <div></div>
      <div>
        <div className="alert alert-danger inline-flex">Failed to lookup isbn {item.isbn}</div>
      </div>
    </>
  );
};

const NoMoreResults = () => {
  return (
    <>
      <div></div>
      <div>
        <hr />
        <div className="alert alert-info">No more recent scans</div>
      </div>
    </>
  );
};

export default RecentScans;
