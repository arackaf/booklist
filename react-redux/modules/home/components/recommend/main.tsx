import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../reducers/search/actionCreators";
import SearchModal from "./searchModal";

@connect(
  null,
  { ...actions }
)
export default class RecommendationList extends Component<Partial<typeof actions>, any> {
  state = { searchModalOpen: false };
  closeModal = () => this.setState({ searchModalOpen: false });
  openModal = () => this.setState({ searchModalOpen: true });
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <button onClick={this.openModal}>Search your books</button>
          </div>
          <div className="col-xs-6">B</div>
        </div>
        <SearchModal isOpen={this.state.searchModalOpen} onHide={this.closeModal} />
      </div>
    );
  }
}
