import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../reducers/search/actionCreators";
import BookSearchModal from "../../../books/components/bookSearchModal";

@connect(
  null,
  { ...actions }
)
export default class RecommendationList extends Component<Partial<typeof actions>, any> {
  state = { searchModalOpen: false };
  render() {
    return (
      <div className="row">
        <div className="col-xs-6">
          <button>Search your books</button>
        </div>
        <div className="col-xs-6">B</div>
      </div>
    );
  }
}
