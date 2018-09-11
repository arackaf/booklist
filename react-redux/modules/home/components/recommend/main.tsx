import React, { Component } from "react";
import { connect } from "react-redux";
import SearchModal from "./searchModal";
import { selectSelectedBooks } from "../../reducers/recommend/reducer";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import { ISearchBookRaw } from "../../reducers/reducer";
import { removeSelectedBook } from "../../reducers/search/actionCreators";
import { findRecommendations } from "../../reducers/recommend/actionCreators";

@connect(
  selectSelectedBooks,
  { findRecommendations }
)
export default class RecommendationList extends Component<Partial<ReturnType<typeof selectSelectedBooks> & { findRecommendations: any }>, any> {
  state = { searchModalOpen: false };
  closeModal = () => this.setState({ searchModalOpen: false });
  openModal = () => this.setState({ searchModalOpen: true });
  render() {
    let { selectedBooks } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <button className="btn btn-default" style={{ marginTop: "5px" }} onClick={this.openModal}>
              Search your books
            </button>
            <br />
            <br />
            <table className="table table-condensed table-striped">
              <TransitionGroup component="tbody">
                {selectedBooks.map((book, i) => (
                  <CSSTransition classNames="fade-transition" timeout={300} key={book._id}>
                    <DisplayBook key={book._id} book={book} />
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </table>
          </div>
          <div className="col-xs-6">
            <button onClick={this.props.findRecommendations}>Get Recommendations</button>
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
