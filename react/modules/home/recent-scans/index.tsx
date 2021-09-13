import React, { FunctionComponent, Suspense, useEffect, useState } from "react";
const { unstable_useTransition: useTransition } = React as any;

import { Queries, QueryOf } from "graphql-typings";
import "./styles.scss";

import RecentScansQuery from "../../../graphQL/recent-scans/recentScans.graphql";
import { useSuspenseQuery } from "micro-graphql-react";
import { LocalLoading } from "app/components/loading";

type Props = any;

const RecentScans: FunctionComponent<Props> = props => {
  const [lastKey, setLastKey] = useState<any>(null);
  const [nextLastKey, setNextLastKey] = useState<any>(null);
  const { data } = useSuspenseQuery<QueryOf<Queries["recentScanResults"]>>(RecentScansQuery, { lastKey });
  const newLastKey = data?.recentScanResults?.LastEvaluatedKey;

  const [recentScans, setRecentScans] = useState<any>([]);

  const [startTransition, loading] = useTransition({ timeoutMs: 9000 });

  const nextScans = data?.recentScanResults?.ScanResults ?? [];

  useEffect(() => {
    setRecentScans(current => current.concat(nextScans));
  }, [nextScans]);

  useEffect(() => {
    setNextLastKey(newLastKey);
  }, [newLastKey]);

  const loadNextScans = () => {
    startTransition(() => {
      setLastKey(nextLastKey);
    });
  };

  return (
    <div>
      {recentScans.map(item => (
        <div>{item.success + ""}</div>
      ))}
      {recentScans.map(item => (
        <div>{item.success + ""}</div>
      ))}
      {nextLastKey ? <button onClick={loadNextScans}>Load More</button> : null}
      <div style={{ position: "absolute" }}>{loading ? <LocalLoading /> : null}</div>
    </div>
  );
};

export default RecentScans;
