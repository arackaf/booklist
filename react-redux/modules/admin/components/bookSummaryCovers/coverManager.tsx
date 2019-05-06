import React, { useState } from "react";
import { useQuery, buildQuery } from "micro-graphql-react";

import SummaryQuery from "graphQL/admin/bookSummaryCoverInfo.graphql";
import styles from "./styles.module.css";
const { bookList, bookDisplay, img, title } = styles;

import delve from "dlv";
import ajaxUtil from "util/ajaxUtil";
import { syncUpdates } from "util/graphqlHelpers";

export const updateSmallCover = ({ _id, url }) => {
  return ajaxUtil
    .post("/bookSummary/newSmallImage", { _id, url })
    .then(({ url, failure }) => {
      if (!failure && url) {
        syncUpdates(SummaryQuery, { _id, smallImage: url }, "allBookSummarys", "BookSummarys", { force: true });
      }
      return { url, failure };
    })
    .catch(() => ({ failure: true, url: "" }));
};

const BookSummaryDisplay = props => {
  const { book } = props;
  const [newUrl, setNewUrl] = useState("");

  const changeImg = evt => {
    evt.preventDefault();
    updateSmallCover({ _id: book._id, url: newUrl });
  };

  return (
    <div className={bookDisplay}>
      <div className={img}>
        <img src={book.smallImage} />
      </div>
      <div className={title}>
        <div>{book.title}</div>
        <form onSubmit={changeImg}>
          <div className="btn-group">
            <input className="form-control" placeholder="New Cover URL" onChange={evt => setNewUrl(evt.target.value)} />
            <button disabled={!newUrl} onClick={changeImg} className="btn btn-default">
              <i className="far fa-cloud-upload-alt" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default props => {
  const { data, loaded } = useQuery(buildQuery(SummaryQuery, {}));
  const bookSummaries = delve(data, "allBookSummarys.BookSummarys") || [];

  return (
    <div className={bookList}>
      {loaded ? (
        <div>
          {bookSummaries.map(book => (
            <BookSummaryDisplay book={book} />
          ))}
        </div>
      ) : (
        <span>
          Loading ... <i className="fa fa-spinner fa-spin" />
        </span>
      )}
    </div>
  );
};
