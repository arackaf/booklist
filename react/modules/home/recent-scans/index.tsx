import React, { FunctionComponent, useEffect, useState } from "react";
const { useTransition } = React as any;

import { Queries, QueryOf, ScanResult } from "gql/graphql-typings";
import "./styles.scss";

import RecentScansQuery from "../../../gql/recent-scans/recentScans.graphql";
import { Button } from "app/components/ui/Button";
import { SuspenseImg } from "app/components/suspenseImage";
import { graphqlClient } from "util/graphql";

const RecentScans: FunctionComponent = () => {
  const [loading, startTransition] = useTransition();

  const [currentNextPageKeys, setCurrentNextPageKeys] = useState<any>([null]);
  const [nextNextPageKey, setNextNextPageKey] = useState<any>(null);

  const x: ScanResult = {
    isbn: "123",
    smallImage: "https://my-library-cover-uploads.s3.amazonaws.com/bookCovers/573d1b97120426ef0078aa92/26ac1fc3-78d5-42d1-9e00-bf6022aa432a.jpg",
    success: true,
    title: "Title"
  };

  const [anyResults, setAnyResults] = useState(false);
  const recentScans = currentNextPageKeys.flatMap(lastKey => {
    const result = graphqlClient.read<QueryOf<Queries["recentScanResults"]>>(RecentScansQuery, { lastKey });
    return result.data?.recentScanResults?.ScanResults ?? [];
  });

  useEffect(() => {
    if (recentScans.length && !anyResults) {
      setAnyResults(true);
    }
  }, [recentScans]);

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
          {recentScans.map((item, i) => (item.success ? <ScanDisplay key={i} item={item} /> : <ScanFailureDisplay item={item} key={i} />))}
          {nextNextPageKey ? (
            <>
              <div></div>
              <Button preset="info" disabled={loading} onClick={loadNextScans}>
                Load More
              </Button>
            </>
          ) : null}
        </div>
      </div>
      {!nextNextPageKey ? <NoMoreResults anyResults={anyResults} /> : null}
    </div>
  );
};

const ScanDisplay = ({ item }) => {
  return (
    <>
      <SuspenseImg alt="Book cover" src={item.smallImage} />
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

const NoMoreResults = ({ anyResults }) => {
  return (
    <div className={anyResults ? "margin-top-med" : ""}>
      <hr />
      <div className="alert alert-info">{anyResults ? "No more recent scans" : "No recent scans"}</div>
    </div>
  );
};

export default RecentScans;
