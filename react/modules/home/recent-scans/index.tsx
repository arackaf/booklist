import React, { FunctionComponent, Suspense, useEffect, useState } from "react";
const { unstable_useTransition: useTransition } = React as any;

import { Queries, QueryOf } from "graphql-typings";
import "./styles.scss";

import RecentScansQuery from "../../../graphQL/recent-scans/recentScans.graphql";
import { useSuspenseQuery } from "micro-graphql-react";
import { LocalLoading } from "app/components/loading";

type Props = any;

const RecentScans: FunctionComponent<Props> = props => {
  const [startTransition, loading] = useTransition({ timeoutMs: 9000 });

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
    <div className="overlay-holder">
      {loading ? <LocalLoading /> : null}
      <div>
        {recentScans.map(item => (
          <div>{item.title ?? `${item.isbn} Failure`}</div>
        ))}

        {nextNextPageKey ? <button onClick={loadNextScans}>Load More</button> : null}
      </div>
    </div>
  );
};

export default RecentScans;
