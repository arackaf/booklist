import React, { memo, FunctionComponent, useContext, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

import { goto } from "reactStartup";
import ajaxUtil from "util/ajaxUtil";
import { AppContext } from "app/renderUI";

import { isAdmin } from "util/loginStatus";
import BookSvg from "./bookSvg";

import navClasses from "css/navbar.module.scss";
import "css/main-mobile-menu.scss";
import { useEffect } from "react";
import { getPendingCount } from "util/localStorage";

const { nav, navHeader, navItems, navItemsRight, numberBadge, bigCount } = navClasses;

const spreadClassNames = (baseCssClasses = "", ...userClasses) => `${baseCssClasses} ${userClasses.join(" ")}`;

const NavBarItem = props => {
  let { disabled, className, active, href, onClick, children, aStyle = {}, ...rest } = props;

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
    ajaxUtil.post("/auth/logout", {}, () => ((window as any).location = "/"));
  };

  let isAdminUser = isAdmin();

  let [{ isPublic, module, isLoggedIn }] = useContext(AppContext);
  let isHome = module == "home";
  let isBookEntry = module == "scan";
  let isBookList = module == "books" || module == "view";
  let isSubjects = module == "subjects";
  let isLoginModule = module == "authenticate";
  let isSettings = module == "settings";
  let isSettingsSection = module == "admin";

  let [pendingCount, setPendingCount] = useState(getPendingCount());

  function handleWsPendingCountUpdate(evt) {
    if (typeof evt?.detail?.pendingCount === "number") {
      setPendingCount(evt.detail.pendingCount);
    }
  }
  useEffect(() => {
    window.addEventListener("ws-info", handleWsPendingCountUpdate);
    return () => window.removeEventListener("ws-info", handleWsPendingCountUpdate);
  }, []);

  return (
    <header>
      <nav className={nav}>
        <div className={`${navHeader} hidden-xs ${isHome && isLoggedIn ? "active" : ""}`}>
          <a onClick={() => goto("home")}>
            <BookSvg height="18" style={{ marginRight: "5px", color: "white", fill: "var(--primary-10)" }} />
            <span>My Library</span>
          </a>
        </div>

        <ul className={navItems}>
          <NavBarItem className="visible-xs" disabled={isPublic} onClick={() => goto("home")} active={isHome} aStyle={{ marginTop: "2px" }}>
            <i className="fal fa-home visible-xs" />
          </NavBarItem>
          {isLoggedIn || isPublic ? (
            <NavBarItem disabled={isPublic} onClick={isPublic ? null : () => goto("scan")} active={isBookEntry} style={{ position: "relative" }}>
              <span className="hidden-xs">Book entry</span>
              <i className="visible-xs fal fa-scanner" />
              {pendingCount ? (
                <span className={`${numberBadge} ${pendingCount > 9 ? bigCount : ""}`}>
                  <span className="overlay-holder">
                    <i className="fas fa-badge"></i>
                    <span>{pendingCount}</span>
                  </span>
                </span>
              ) : null}
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
      </nav>
      <div id="main-mobile-menu" className="main-mobile-menu"></div>
    </header>
  );
};

export default MainNavigationBar;

const _MobileMenu = ({ title, open, onClose, children }) => {
  const [el] = useState(() => document.getElementById("main-mobile-menu"));
  useLayoutEffect(() => el.classList[open ? "add" : "remove"]("open"), [open]);

  return createPortal(
    <div className="mobile-menu-content">
      <div>
        <div className="header">
          <a style={{ fontSize: "1.4rem", alignSelf: "start" }} onClick={onClose}>
            <i className="far fa-bars"></i>
          </a>
          <h3 style={{ margin: "0 0 0 10px", alignSelf: "center" }}>{title}</h3>
        </div>
        {children}
      </div>
    </div>,
    el
  );
};

export const MobileMenu = memo(_MobileMenu);
