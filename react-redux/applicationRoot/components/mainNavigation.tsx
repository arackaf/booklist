import React, { Component } from "react";
import { connect } from "react-redux";

import NavBar from "simple-react-bootstrap/lib/navBar";
import { goto } from "reactStartup";
import ajaxUtil from "util/ajaxUtil";

@connect(state => state.app)
export default class MainNavigationBar extends Component<any, any> {
  el: any;
  logout = () => {
    localStorage.setItem("reduxState", "");
    ajaxUtil.post("/react-redux/logout", {}, () => window.location.reload());
  };
  componentDidUpdate(prevProps) {
    if (prevProps.module != this.props.module) {
      this.el.closeIfOpen();
    }
  }
  render() {
    let { isPublic, publicBooksHeader, publicName, module, isLoggedIn } = this.props,
      isBookEntry = module == "scan",
      isBookList = module == "books",
      isSubjects = module == "subjects",
      isLoginModule = module == "authenticate",
      isSettings = module == "settings";

    return (
      <NavBar
        ref={el => (this.el = el)}
        style={{ borderRadius: 0, borderRight: 0, borderLeft: 0, borderTop: 0, position: "fixed", top: 0, left: 0, right: 0, zIndex: 500 }}
      >
        <NavBar.Header>
          <NavBar.Brand>
            <a className="navbar-brand" onClick={() => goto("home")} style={{ cursor: "pointer" }}>
              <img height="32" width="32" style={{ display: "inline-block", marginTop: "-5px" }} src="react-redux/static/main-icon2.png" />
              <span style={{ display: "inline-block", verticalAlign: "top", marginLeft: "5px" }}>My Library</span>
            </a>
          </NavBar.Brand>
        </NavBar.Header>
        <NavBar.Nav>
          {isLoggedIn || isPublic ? (
            <NavBar.Item disabled={isPublic} onClick={isBookEntry || isPublic ? null : () => goto("scan")} active={isBookEntry}>
              Book entry
            </NavBar.Item>
          ) : null}
          {isLoggedIn || isPublic ? (
            <NavBar.Item active={isBookList} onClick={isBookList ? null : () => goto("books")}>
              Books
            </NavBar.Item>
          ) : null}
          {isLoggedIn || isPublic ? (
            <NavBar.Item disabled={isPublic} onClick={() => goto("subjects")} active={isSubjects}>
              Subjects
            </NavBar.Item>
          ) : null}
          {isLoggedIn && isPublic ? <NavBar.Item onClick={() => goto("books")}>View your collection</NavBar.Item> : null}
          {isLoggedIn || isPublic ? (
            <NavBar.Item disabled={isPublic} onClick={isPublic ? null : () => goto("settings")} active={isSettings}>
              Settings
            </NavBar.Item>
          ) : null}
          {null && isLoggedIn ? (
            <NavBar.Item onClick={() => {}} active={false} disabled={false}>
              <i className="fa fa-fw fa-refresh" />
            </NavBar.Item>
          ) : null}
          {!isLoggedIn && !isLoginModule ? <NavBar.Item onClick={() => goto("login")}>Login</NavBar.Item> : null}
        </NavBar.Nav>
        {isLoggedIn ? (
          <NavBar.Nav className="pull-right">
            <NavBar.Item className="pull-right" onClick={this.logout}>
              Logout
            </NavBar.Item>
          </NavBar.Nav>
        ) : null}
      </NavBar>
    );
  }
}
