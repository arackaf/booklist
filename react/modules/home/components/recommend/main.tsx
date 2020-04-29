import React, { useState, useReducer, useMemo, useContext } from "react";
import SearchModal from "./searchModal";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import ajaxUtil from "util/ajaxUtil";
import FlexRow from "app/components/layout/FlexRow";
import Stack from "app/components/layout/Stack";
import FlowItems from "app/components/layout/FlowItems";
import { AppContext } from "app/renderUI";
import { CoverSmall } from "app/components/bookCoverComponent";

const initialState = {
  selectedBooks: [],
  recommendationsLoading: false,
  recommendations: []
};
function reducer(state, [type, payload = null]) {
  switch (type) {
    case "selectBook":
      return { ...state, selectedBooks: [...state.selectedBooks, payload] };
    case "deSelectBook":
      return { ...state, selectedBooks: state.selectedBooks.filter(b => b != payload) };
    case "startRecommendationsFetch":
      return { ...state, recommendationsLoading: true };
    case "setRecommendations":
      return { ...state, recommendationsLoading: false, recommendations: payload };
  }
  return state;
}

export default props => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [{ selectedBooks, recommendations, recommendationsLoading }, dispatch] = useReducer(reducer, initialState);
  const [{ publicUserId }] = useContext(AppContext);

  const closeModal = () => {
    setSearchModalOpen(false);
  };
  const openModal = () => setSearchModalOpen(true);

  const selectedBooksSet = useMemo(() => new Set(selectedBooks.map(b => b._id)), [selectedBooks]);

  const getRecommendations = publicUserId => {
    dispatch(["startRecommendationsFetch"]);
    ajaxUtil.post("/book/getRecommendations", { bookIds: [...selectedBooksSet], publicUserId }).then(resp => {
      dispatch(["setRecommendations", resp.results]);
    });
  };

  return (
    <div className="margin-top">
      <FlexRow>
        <div className="col-xs-6">
          <Stack loosest={true}>
            <div style={{ fontWeight: "bold" }}>Find some books, and get recommendations based on what's similar</div>

            <FlowItems pushLast={true}>
              <button className="btn btn-default" onClick={openModal}>
                <i className="fal fa-search" /> Search your books
              </button>

              {selectedBooks.length ? (
                <button
                  onClick={() => getRecommendations(publicUserId)}
                  disabled={recommendationsLoading}
                  style={{ marginLeft: "auto" }}
                  className="btn btn-primary"
                >
                  {recommendationsLoading ? <i className="fa fa-fw fa-spin fa-spinner" /> : null} Get Recommendations
                </button>
              ) : null}
            </FlowItems>

            <table className="table table-condensed table-striped">
              <TransitionGroup component="tbody">
                {selectedBooks.map(book => (
                  <CSSTransition classNames="bl-animate" timeout={300} key={book._id}>
                    <DisplayBook className="bl-fade" key={book._id} book={book} dispatch={dispatch} />
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </table>
          </Stack>
        </div>
        <div className="col-xs-6">
          <div>
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
      </FlexRow>
      <SearchModal isOpen={searchModalOpen} onHide={closeModal} {...{ dispatch, selectedBooksSet }} />
    </div>
  );
};

const DisplayBook = props => {
  const { book } = props;
  return (
    <tr className={props.className}>
      <td>
        <button onClick={() => props.dispatch(["deSelectBook", book])} style={{ cursor: "pointer" }} className="btn btn-xs btn-danger">
          Remove
        </button>
      </td>
      <td>
        <CoverSmall url={book.smallImage} />
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
        <CoverSmall url={book.smallImage} />
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
