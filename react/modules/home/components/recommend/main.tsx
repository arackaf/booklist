import React, { useState, useReducer, useMemo } from "react";
import SearchModal from "./searchModal";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import BooksQuery from "graphQL/home/searchBooks.graphql";
import { useQuery, buildQuery } from "micro-graphql-react";
import ajaxUtil from "util/ajaxUtil";
import { getCrossOriginAttribute } from "util/corsHelpers";
import { QueryOf, Queries } from "graphql-typings";

const initialState = {
  selectedBooks: [],
  recommendationsLoading: false,
  recommendations: [],
  searchState: {
    active: false,
    page: 1,
    pageSize: 50,
    sort: { title: 1 },
    tags: [],
    subjects: []
  }
};
function reducer(state, [type, payload = null]) {
  switch (type) {
    case "selectBook":
      return { ...state, selectedBooks: [...state.selectedBooks, payload] };
    case "deSelectBook":
      return { ...state, selectedBooks: state.selectedBooks.filter(b => b != payload) };
    case "setSearchState":
      return { ...state, searchState: { active: true, page: 1, ...payload } };
    case "startRecommendationsFetch":
      return { ...state, recommendationsLoading: true };
    case "setRecommendations":
      return { ...state, recommendationsLoading: false, recommendations: payload };
  }
  return state;
}

export default props => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [{ selectedBooks, recommendations, recommendationsLoading, searchState }, dispatch] = useReducer(reducer, initialState);
  const { active, ...searchStateToUse } = searchState;

  const { loading, loaded, data, error } = useQuery<QueryOf<Queries["allBooks"]>>(buildQuery(BooksQuery, searchStateToUse, { active }));
  const closeModal = () => setSearchModalOpen(false);
  const openModal = () => setSearchModalOpen(true);
  const setBookSearchState = searchState => {
    dispatch(["setSearchState", searchState]);
  };

  const selectedBooksSet = useMemo(() => new Set(selectedBooks.map(b => b._id)), [selectedBooks]);

  const getRecommendations = () => {
    dispatch(["startRecommendationsFetch"]);
    ajaxUtil.post("/book/getRecommendations", { bookIds: [...selectedBooksSet] }).then(resp => {
      dispatch(["setRecommendations", resp.results]);
    });
  };

  return (
    <div>
      <div className="row margin-top">
        <div className="col-xs-6">
          <div style={{ marginTop: "5px" }}>
            <div className="margin-top" style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Find some books, and get recommendations based on what's similar
            </div>
            <div className="margin-top" style={{ display: "flex" }}>
              <button className="btn btn-default" onClick={openModal}>
                <i className="fal fa-search" /> Search your books
              </button>
              {selectedBooks.length ? (
                <button onClick={getRecommendations} disabled={recommendationsLoading} style={{ marginLeft: "auto" }} className="btn btn-primary">
                  {recommendationsLoading ? <i className="fa fa-fw fa-spin fa-spinner" /> : null} Get Recommendations
                </button>
              ) : null}
            </div>
          </div>
          <br />
          <br />
          <table className="table table-condensed table-striped">
            <TransitionGroup component="tbody">
              {selectedBooks.map(book => (
                <CSSTransition classNames="fade-transition" timeout={300} key={book._id}>
                  <DisplayBook key={book._id} book={book} dispatch={dispatch} />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </table>
        </div>
        <div className="col-xs-6">
          <div style={{ marginTop: "5px" }}>
            {recommendations.length ? (
              <>
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Similar books found</div>
                <table className="table table-condensed table-striped">
                  <tbody>
                    {recommendations.map(book => (
                      <DisplayRecommendation key={book._id} book={book} />
                    ))}
                  </tbody>
                </table>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <SearchModal
        isOpen={searchModalOpen}
        onHide={closeModal}
        searchResults={{ loading, loaded, data, error }}
        {...{ setBookSearchState, searchState, dispatch, selectedBooksSet }}
      />
    </div>
  );
};

const DisplayBook = props => {
  const { book } = props;
  return (
    <tr>
      <td>
        <button onClick={() => props.dispatch(["deSelectBook", book])} style={{ cursor: "pointer" }} className="btn btn-xs btn-danger">
          Remove
        </button>
      </td>
      <td>
        <img src={book.smallImage} {...getCrossOriginAttribute(book.smallImage)} />
      </td>
      <td>
        {book.title}
        {book.authors && book.authors.length ? (
          <>
            <br />
            <span style={{ fontStyle: "italic" }}>{book.authors.join(", ")}</span>
          </>
        ) : null}
      </td>
    </tr>
  );
};

const DisplayRecommendation = props => {
  let { book } = props;
  return (
    <tr>
      <td>
        <img src={book.smallImage} />
      </td>
      <td>
        {book.title}
        {book.authors && book.authors.length ? (
          <>
            <br />
            <span style={{ fontStyle: "italic" }}>{book.authors.join(", ")}</span>
            <br />
            {book.isbn ? (
              <a target="_new" className="margin-right" href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}>
                <i className="fab fa-amazon" />
              </a>
            ) : null}
          </>
        ) : null}
      </td>
    </tr>
  );
};
