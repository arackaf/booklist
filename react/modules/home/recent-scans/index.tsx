import React, { FunctionComponent, Suspense, useEffect, useState } from "react";
const { useTransition } = React as any;

import { Queries, QueryOf } from "graphql-typings";
import "./styles.scss";

import RecentScansQuery from "../../../graphQL/recent-scans/recentScans.graphql";
import { useSuspenseQuery } from "micro-graphql-react";
import { Button } from "app/components/ui/Button";
import { SuspenseImg } from "app/components/suspenseImage";
import { graphqlClient } from "util/graphql";

type Props = any;

const RecentScans: FunctionComponent<Props> = props => {
  const [loading, startTransition] = useTransition();

  const [currentNextPageKeys, setCurrentNextPageKeys] = useState<any>([null]);
  const [nextNextPageKey, setNextNextPageKey] = useState<any>(null);

  const recentScans = currentNextPageKeys.flatMap(lastKey => {
    const result = graphqlClient.read<any>(RecentScansQuery, { lastKey });
    return result?.data?.recentScanResults?.ScanResults ?? [];
  });
  const latestKey = currentNextPageKeys[currentNextPageKeys.length - 1];
  const latestKeyData = graphqlClient.read<any>(RecentScansQuery, { lastKey: latestKey });
  const newLastKey = latestKeyData?.data?.recentScanResults?.LastEvaluatedKey;

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
          {recentScans.map((item, i) =>
            item.success ? (
              <>
                <SuspenseImg src={item.smallImage} />
                <div key={i}>{item.title ?? `${item.isbn} Failure`}</div>
              </>
            ) : (
              <>
                <div></div>
                <div>
                  <div className="alert alert-danger inline-flex">Failed to lookup isbn {item.isbn}</div>
                </div>
              </>
            )
          )}
          {nextNextPageKey ? (
            <>
              <div></div>
              <Button preset="info" disabled={loading} onClick={loadNextScans}>
                Load More
              </Button>
            </>
          ) : (
            <>
              <div></div>
              <div>
                <hr />
                <div className="alert alert-info">No more recent scans</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentScans;
