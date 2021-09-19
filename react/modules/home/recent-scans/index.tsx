import React, { FunctionComponent, Suspense, useEffect, useReducer, useRef, useState } from "react";
const { unstable_useTransition: useTransition } = React as any;

import { Queries, QueryOf } from "graphql-typings";
import "./styles.scss";

import RecentScansQuery from "../../../graphQL/recent-scans/recentScans.graphql";
import { useQuery } from "micro-graphql-react";
import { LocalLoading } from "app/components/loading";

type Props = any;

const initialState = {
  nextNextPageKey: "",
  currentScans: []
};
function scanStateReducer(state, data) {
  const newLastKey = data?.recentScanResults?.LastEvaluatedKey;
  const nextScans = data?.recentScanResults?.ScanResults ?? [];

  return { nextNextPageKey: newLastKey, currentScans: state.currentScans.concat(nextScans) };
}

const RecentScans: FunctionComponent<Props> = props => {
  const [currentNextPageKey, setCurrentNextPageKey] = useState<any>(null);
  const lastNewScans = useRef<any>(null);

  const [{ nextNextPageKey, currentScans }, dispatch] = useReducer(scanStateReducer, initialState);
  const { data, loading } = useQuery<QueryOf<Queries["recentScanResults"]>>(RecentScansQuery, { lastKey: currentNextPageKey });

  const nextScans = data?.recentScanResults?.ScanResults ?? [];

  useEffect(() => {
    if (nextScans.length && nextScans != lastNewScans.current) {
      lastNewScans.current = nextScans;
      dispatch(data);
    }
  }, [nextScans]);

  const loadNextScans = () => {
    setCurrentNextPageKey(nextNextPageKey);
  };

  return (
    <div className="overlay-holder">
      {loading ? <LocalLoading /> : null}
      <div>
        {currentScans.map((item, i) => (
          <div key={i}>{item.title ?? `${item.isbn} Failure`}</div>
        ))}
        {nextNextPageKey ? <button onClick={loadNextScans}>Load More</button> : null}
      </div>
    </div>
  );
};

export default RecentScans;
