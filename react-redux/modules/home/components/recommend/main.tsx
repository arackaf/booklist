import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../reducers/recommend/actionCreators";

@connect(
  null,
  { ...actions }
)
export default class RecommendationList extends Component<Partial<typeof actions>, never> {
  render() {
    return (
      <div className="row">
        <div className="col-xs-6">
          A<button onClick={this.props.booksSearch}>Search</button>
        </div>
        <div className="col-xs-6">B</div>
      </div>
    );
  }
}
