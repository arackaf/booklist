import React, { useState, useReducer, useMemo } from "react";
import SearchModal from "./searchModal";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import { TagsContext, useTagsState } from "applicationRoot/tagsState";
import BooksQuery from "graphQL/home/searchBooks.graphql";
import { useQuery, buildQuery } from "micro-graphql-react";

const initialState = {
  selectedBooks: [],
  recommendations: [],
  recommendationsSearching: false,
  searchState: {
    active: false,
    page: 1,
    pageSize: 50,
    sort: { title: 1 },
    tags: [],
    subjects: []
  }
};
function reducer(state, [type, payload]) {
  switch (type) {
    case "selectBook":
      return { ...state, selectedBooks: [...state.selectedBooks, payload] };
    case "deSelectBook":
      return { ...state, selectedBooks: state.selectedBooks.filter(b => b != payload) };
    case "setSearchState":
      return { ...state, searchState: { active: true, page: 1, ...payload } };
  }
  return state;
}

export default props => {
  const tagsState = useTagsState();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [{ selectedBooks, recommendations, recommendationsSearching, searchState }, dispatch] = useReducer(reducer, initialState);
  const { active, ...searchStateToUse } = searchState;

  const { loading, loaded, data, error } = useQuery(buildQuery(BooksQuery, searchStateToUse, { active }));
  const closeModal = () => setSearchModalOpen(false);
  const openModal = () => setSearchModalOpen(true);
  const setBookSearchState = searchState => {
    dispatch(["setSearchState", searchState]);
  };

  const selectedBooksSet = useMemo(() => new Set(selectedBooks.map(b => b._id)), [selectedBooks]);

  return (
    <TagsContext.Provider value={tagsState}>
      <div>
        <div className="row">
          <div className="col-xs-6">
            <div style={{ marginTop: "5px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Find some books, and get Amazon recommendations based on what's similar</div>
              <button className="btn btn-default" onClick={openModal}>
                <i className="fal fa-search" /> Search your books
              </button>
              {selectedBooks.length ? (
                recommendationsSearching ? (
                  <button disabled={true} className="btn btn-default btn-primary pull-right" onClick={props.findRecommendations}>
                    <i className="fa fa-fw fa-spin fa-spinner" /> Get Recommendations
                  </button>
                ) : (
                  <button className="btn btn-default btn-primary pull-right" onClick={props.findRecommendations}>
                    Get Recommendations
                  </button>
                )
              ) : null}
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
              {recommendations && recommendations.length ? (
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
    </TagsContext.Provider>
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
        <img src={book.smallImage} />
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
              <a
                target="_new"
                className="margin-right grid-hover-filter inline-filter"
                href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}
              >
                <i className="fab fa-amazon" />
              </a>
            ) : null}
          </>
        ) : null}
      </td>
    </tr>
  );
};
