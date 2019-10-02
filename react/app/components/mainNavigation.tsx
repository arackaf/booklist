import React, { FunctionComponent, useContext } from "react";

import { goto } from "reactStartup";
import ajaxUtil from "util/ajaxUtil";
import { AppContext } from "app/renderUI";

import navClasses from "css/navbar.module.scss";
import { isAdmin } from "util/loginStatus";

const { nav, navHeader, navItems, navItemsRight } = navClasses;

const spreadClassNames = (baseCssClasses = "", ...userClasses) => `${baseCssClasses} ${userClasses.join(" ")}`;

const NavBarItem = props => {
  let { disabled, className, active, href, onClick, children, aStyle = {}, ...rest } = props;
  let hrefToUse = !disabled && !active ? null : href;

  return (
    <li className={spreadClassNames(className, !!disabled ? "disabled" : "", active ? "active" : "")} {...rest}>
      <a style={aStyle} onClick={onClick}>
        {children}
      </a>
    </li>
  );
};

const MainNavigationBar: FunctionComponent<{}> = props => {
  const logout = () => {
    ajaxUtil.post("/react/logout", {}, () => window.location.reload());
  };

  let isAdminUser = isAdmin();

  let [{ isPublic, module, isLoggedIn }] = useContext(AppContext);
  let isHome = module == "home";
  let isBookEntry = module == "scan";
  let isBookList = module == "books";
  let isSubjects = module == "subjects";
  let isLoginModule = module == "authenticate";
  let isSettings = module == "settings";
  let isSettingsSection = module == "admin";

  return (
    <div className={nav} style={{ marginBottom: "5px" }}>
      <div className={`${navHeader} hidden-xs ${isHome ? "active" : ""}`}>
        <a onClick={() => goto("home")}>
          <i className="fal fa-book" style={{ marginRight: "5px" }} />
          <span>My Library</span>
        </a>
      </div>

      <ul className={navItems}>
        <NavBarItem className="visible-xs" disabled={isPublic} onClick={() => goto("home")} active={isHome} aStyle={{ marginTop: "2px" }}>
          <i className="fal fa-home visible-xs" />
        </NavBarItem>
        {isLoggedIn || isPublic ? (
          <NavBarItem disabled={isPublic} onClick={isPublic ? null : () => goto("scan")} active={isBookEntry}>
            <span className="hidden-xs">Book entry</span>
            <i className="visible-xs fal fa-scanner" />
          </NavBarItem>
        ) : null}
        {isLoggedIn || isPublic ? (
          <NavBarItem active={isBookList} onClick={() => goto(isPublic ? "view" : "books")}>
            <span className="hidden-xs">Books</span>
            <i className="visible-xs fal fa-books" />
          </NavBarItem>
        ) : null}
        {isLoggedIn || isPublic ? (
          <NavBarItem disabled={isPublic} onClick={isPublic ? null : () => goto("subjects")} active={isSubjects}>
            <span className="hidden-xs">Subjects</span>
            <i className="visible-xs fal fa-sitemap" />
          </NavBarItem>
        ) : null}
        {isLoggedIn || isPublic ? (
          <NavBarItem onClick={() => goto("settings")} active={isSettings}>
            <span className="hidden-xs">Settings</span>
            <i className="visible-xs fal fa-cogs" />
          </NavBarItem>
        ) : null}
        {isLoggedIn && isAdminUser ? (
          <NavBarItem onClick={() => goto("admin")} active={isSettingsSection}>
            <span className="hidden-xs">Admin</span>
            <i className="visible-xs fal fa-users-cog" />
          </NavBarItem>
        ) : null}
      </ul>
      <ul className={navItemsRight}>
        {!isLoggedIn && !isLoginModule ? (
          <NavBarItem onClick={() => goto("login")}>
            <span className="hidden-xs">Login</span>
            <i className="visible-xs fal fa-sign-in" />
          </NavBarItem>
        ) : null}
      </ul>
      {isLoggedIn ? (
        <ul className={navItemsRight}>
          <NavBarItem onClick={logout}>
            <span className="hidden-xs">Logout</span>
            <i className="visible-xs fal fa-sign-out" />
          </NavBarItem>
        </ul>
      ) : null}
    </div>
  );
};

export default MainNavigationBar;
