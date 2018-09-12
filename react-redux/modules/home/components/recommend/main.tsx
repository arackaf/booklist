import React, { Component } from "react";
import { connect } from "react-redux";
import SearchModal from "./searchModal";
import { selectSelectedBooks, selectRecommendations } from "../../reducers/recommend/reducer";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import { ISearchBookRaw } from "../../reducers/reducer";
import { removeSelectedBook } from "../../reducers/search/actionCreators";
import { findRecommendations } from "../../reducers/recommend/actionCreators";
import { combineSelectors } from "applicationRoot/rootReducer";

const mainSelector = combineSelectors(selectSelectedBooks, selectRecommendations);

@connect(
  mainSelector,
  { findRecommendations }
)
export default class RecommendationList extends Component<Partial<ReturnType<typeof mainSelector> & { findRecommendations: any }>, any> {
  state = { searchModalOpen: false };
  closeModal = () => this.setState({ searchModalOpen: false });
  openModal = () => this.setState({ searchModalOpen: true });
  render() {
    let { selectedBooks, recommendations, recommendationsSearching } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <div style={{ marginTop: "5px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Find some books, and get Amazon recommendations based on what's similar</div>
              <button className="btn btn-default" onClick={this.openModal}>
                <i className="fal fa-search" /> Search your books
              </button>
              {selectedBooks.length ? (
                recommendationsSearching ? (
                  <button disabled={true} className="btn btn-default btn-primary pull-right" onClick={this.props.findRecommendations}>
                    <i className="fa fa-fw fa-spin fa-spinner" /> Get Recommendations
                  </button>
                ) : (
                  <button className="btn btn-default btn-primary pull-right" onClick={this.props.findRecommendations}>
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
                    <DisplayBook key={book._id} book={book} />
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
        <SearchModal isOpen={this.state.searchModalOpen} onHide={this.closeModal} />
      </div>
    );
  }
}

@connect(
  null,
  { removeSelectedBook }
)
class DisplayBook extends Component<{ book: ISearchBookRaw; selectBookToSearchRecommendationsFor?: any; removeSelectedBook?: any }, any> {
  removeBook = () => this.props.removeSelectedBook(this.props.book);
  render() {
    let { book } = this.props;
    return (
      <tr>
        <td>
          <button onClick={this.removeBook} style={{ cursor: "pointer" }} className="btn btn-xs btn-danger">
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
  }
}

class DisplayRecommendation extends Component<{ book: ISearchBookRaw; selectBookToSearchRecommendationsFor?: any; removeSelectedBook?: any }, any> {
  removeBook = () => this.props.removeSelectedBook(this.props.book);
  render() {
    let { book } = this.props;
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
  }
}
