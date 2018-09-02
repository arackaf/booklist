import React, { Component } from "react";
import { connect } from "react-redux";

import { goto } from "reactStartup";
import ajaxUtil from "util/ajaxUtil";

const spreadClassNames = (baseCssClasses = "", ...userClasses) => `${baseCssClasses} ${userClasses.join(" ")}`;

const NavBarItem = props => {
  let { disabled, className, active, href, children, ...rest } = props;

  return (
    <li disabled={!!disabled} className={spreadClassNames(className, !!disabled ? "disabled" : "", active ? "active" : "")} {...rest}>
      <a href={href}>{children}</a>
    </li>
  );
};

@connect(state => state.app)
export default class MainNavigationBar extends Component<any, any> {
  el: any;
  logout = () => {
    localStorage.setItem("reduxState", "");
    ajaxUtil.post("/react-redux/logout", {}, () => window.location.reload());
  };
  render() {
    let { isPublic, publicBooksHeader, publicName, module, isLoggedIn } = this.props,
      isHome = module == "home",
      isBookEntry = module == "scan",
      isBookList = module == "books",
      isSubjects = module == "subjects",
      isLoginModule = module == "authenticate",
      isSettings = module == "settings";

    return (
      <nav
        className="navbar navbar-default main-navbar"
        style={{ borderRadius: 0, borderRight: 0, borderLeft: 0, borderTop: 0, position: "fixed", top: 0, left: 0, right: 0, zIndex: 500 }}
      >
        <div className="container-fluid">
          <div className="navbar-header hidden-xs" ref={el => (this.el = el)}>
            <a className="navbar-brand" onClick={() => goto("home")} style={{ cursor: "pointer" }}>
              <img height="32" width="32" style={{ display: "inline-block", marginTop: "-5px" }} src="react-redux/static/main-icon2.png" />
              <span style={{ display: "inline-block", verticalAlign: "top", marginLeft: "5px" }}>My Library</span>
            </a>
          </div>

          <ul className="nav navbar-nav">
            <NavBarItem className="visible-xs" disabled={isPublic} onClick={() => goto("home")} active={isHome}>
              <i className="fal fa-home visible-xs" />
            </NavBarItem>
            {isLoggedIn || isPublic ? (
              <NavBarItem disabled={isPublic} onClick={isBookEntry || isPublic ? null : () => goto("scan")} active={isBookEntry}>
                <span className="hidden-xs">Book entry</span>
                <i className="visible-xs fal fa-scanner" />
              </NavBarItem>
            ) : null}
            {isLoggedIn || isPublic ? (
              <NavBarItem active={isBookList} onClick={isBookList ? null : () => goto("books")}>
                <span className="hidden-xs">Books</span>
                <i className="visible-xs fal fa-books" />
              </NavBarItem>
            ) : null}
            {isLoggedIn || isPublic ? (
              <NavBarItem disabled={isPublic} onClick={() => goto("subjects")} active={isSubjects}>
                <span className="hidden-xs">Subjects</span>
                <i className="visible-xs fal fa-tags" />
              </NavBarItem>
            ) : null}
            {isLoggedIn && isPublic ? (
              <NavBarItem onClick={() => goto("books")}>
                <span className="hidden-xs">View your collection</span>
                <i className="visible-xs fal fa-eye" />
              </NavBarItem>
            ) : null}
            {isLoggedIn || isPublic ? (
              <NavBarItem disabled={isPublic} onClick={isPublic ? null : () => goto("settings")} active={isSettings}>
                <span className="hidden-xs">Settings</span>
                <i className="visible-xs fal fa-cogs" />
              </NavBarItem>
            ) : null}
            {!isLoggedIn && !isLoginModule ? (
              <NavBarItem onClick={() => goto("login")}>
                <span>Login</span>
              </NavBarItem>
            ) : null}
          </ul>
          {isLoggedIn ? (
            <ul className={"nav navbar-nav pull-right"}>
              <NavBarItem className="pull-right" onClick={this.logout}>
                <span className="hidden-xs">Logout</span>
                <i className="visible-xs fal fa-sign-out" />
              </NavBarItem>
            </ul>
          ) : null}
        </div>
      </nav>
    );
  }
}
