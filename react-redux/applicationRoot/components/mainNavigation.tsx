import React, { Component, FunctionComponent, useContext } from "react";

import { goto } from "reactStartup";
import ajaxUtil from "util/ajaxUtil";
import { AppContext } from "applicationRoot/renderUI";

const spreadClassNames = (baseCssClasses = "", ...userClasses) => `${baseCssClasses} ${userClasses.join(" ")}`;

const NavBarItem = props => {
  let { disabled, className, active, href, children, ...rest } = props;

  return (
    <li disabled={!!disabled} className={spreadClassNames(className, !!disabled ? "disabled" : "", active ? "active" : "")} {...rest}>
      <a href={href}>{children}</a>
    </li>
  );
};

const MainNavigationBar: FunctionComponent<{}> = props => {
  const logout = () => {
    localStorage.setItem("reduxState", "");
    ajaxUtil.post("/react-redux/logout", {}, () => window.location.reload());
  };

  let [{ isPublic, publicBooksHeader, publicName, module, isLoggedIn }] = useContext(AppContext);
  let isHome = module == "home";
  let isBookEntry = module == "scan";
  let isBookList = module == "books";
  let isSubjects = module == "subjects";
  let isLoginModule = module == "authenticate";
  let isSettings = module == "settings";

  return (
    <nav className="navbar navbar-default main-navbar" style={{ borderRadius: 0, borderRight: 0, borderLeft: 0, borderTop: 0, marginBottom: "5px" }}>
      <div className="container-fluid">
        <div className="navbar-header hidden-xs">
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
              <i className="visible-xs fal fa-sitemap" />
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
              <span className="hidden-xs">Login</span>
              <i className="visible-xs fal fa-sign-in" />
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
};

export default MainNavigationBar;
