import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { store } from "../store";

@connect(state => state)
export default class Header extends Component<any, any> {
  render() {
    return <div>{this.props.app.module}</div>;
  }
}
