import React, { FunctionComponent, Suspense, useEffect, useState } from "react";
const { useTransition } = React as any;

import { Queries, QueryOf } from "graphql-typings";
import "./styles.scss";

import RecentScansQuery from "../../../graphQL/recent-scans/recentScans.graphql";
import { useSuspenseQuery } from "micro-graphql-react";
import { Button } from "app/components/ui/Button";
import { SuspenseImg } from "app/components/suspenseImage";

type Props = any;

const RecentScans: FunctionComponent<Props> = props => {
  const [loading, startTransition] = useTransition();

  const [currentNextPageKey, setCurrentNextPageKey] = useState<any>(null);
  const [nextNextPageKey, setNextNextPageKey] = useState<any>(null);
  const { data } = useSuspenseQuery<QueryOf<Queries["recentScanResults"]>>(RecentScansQuery, { lastKey: currentNextPageKey });
  const newLastKey = data?.recentScanResults?.LastEvaluatedKey;

  const [recentScans, setRecentScans] = useState<any>([]);

  const nextScans = data?.recentScanResults?.ScanResults ?? [];

  useEffect(() => {
    setRecentScans(current => current.concat(nextScans));
  }, [nextScans]);

  useEffect(() => {
    setNextNextPageKey(newLastKey);
  }, [newLastKey]);

  const loadNextScans = () => {
    startTransition(() => {
      setCurrentNextPageKey(nextNextPageKey);
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
                <div className="alert alert-info inline-flex">No more recent scans</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentScans;
