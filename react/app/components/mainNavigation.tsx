import React, { memo, FunctionComponent, useContext, useState, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

import { goto } from "util/urlHelpers";
import ajaxUtil from "util/ajaxUtil";
import { AppContext } from "app/state/appState";

import { isAdmin } from "util/loginStatus";
import BookSvg from "./bookSvg";

import "styles/navbar.scss";
import "styles/main-mobile-menu.scss";

const spreadClassNames = (baseCssClasses = "", ...userClasses) => `${baseCssClasses} ${userClasses.join(" ")}`;

const NavBarItem = props => {
  let { disabled, className, active, href, onClick, children, aStyle = {}, ...rest } = props;
  let label = rest["aria-label"];

  return (
    <li className={spreadClassNames(className, !!disabled ? "disabled" : "", active ? "active" : "")} {...rest}>
      <a
        aria-label={label}
        className="no-underline"
        href={href}
        style={aStyle}
        onClick={e => {
          e.preventDefault();
          onClick();
        }}
      >
        {children}
      </a>
    </li>
  );
};

const MainNavigationBar: FunctionComponent<{}> = props => {
  const logout = () => {
    ajaxUtil.postAuth("/logout", {}, () => ((window as any).location = "/"));
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

  let [pendingCount, setPendingCount] = useState(0);

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
    <header className="master-nav">
      <nav className="nav">
        <div className={`nav-header hidden-xs ${isHome && isLoggedIn ? "active" : ""}`}>
          <a
            aria-label="Navigate home"
            href="/home"
            onClick={e => {
              e.preventDefault();
              goto("home");
            }}
            className="no-underline"
          >
            <BookSvg height="18" style={{ marginRight: "10px", color: "white", fill: "var(--primary-10)" }} />
            <span>My Library</span>
          </a>
        </div>

        <ul className="nav-items">
          <NavBarItem
            aria-label="Navigate home"
            href="/home"
            className="visible-xs"
            disabled={isPublic}
            onClick={() => goto("home")}
            active={isHome}
            aStyle={{ marginTop: "2px" }}
          >
            <i className="fal fa-fw fa-home visible-xs" />
          </NavBarItem>
          {isLoggedIn || isPublic ? (
            <NavBarItem
              aria-label="Navigate to scan page"
              href="/scan"
              disabled={isPublic}
              onClick={isPublic ? null : () => goto("scan")}
              active={isBookEntry}
              style={{ position: "relative" }}
            >
              <span className="hidden-xs">Book entry</span>
              <i className="visible-xs fal fa-fw fa-scanner" />
              {pendingCount ? (
                <span className={`number-badge ${pendingCount > 9 ? "big-count" : ""}`}>
                  <span className="overlay-holder">
                    <i className="fas fa-badge"></i>
                    <span>{pendingCount}</span>
                  </span>
                </span>
              ) : null}
            </NavBarItem>
          ) : null}
          {isLoggedIn || isPublic ? (
            <NavBarItem
              aria-label="Navigate to books page"
              href={"/" + isPublic ? "view" : "books"}
              active={isBookList}
              onClick={() => goto(isPublic ? "view" : "books")}
            >
              <span className="hidden-xs">Books</span>
              <i className="visible-xs fal fa-fw fa-books" />
            </NavBarItem>
          ) : null}
          {isLoggedIn || isPublic ? (
            <NavBarItem
              aria-label="Navigate to subjects page"
              href="/subjects"
              disabled={isPublic}
              onClick={isPublic ? null : () => goto("subjects")}
              active={isSubjects}
            >
              <span className="hidden-xs">Subjects</span>
              <i className="visible-xs fal fa-fw fa-sitemap" />
            </NavBarItem>
          ) : null}
          {isLoggedIn || isPublic ? (
            <NavBarItem aria-label="Navigate to settings page" href="/settings" onClick={() => goto("settings")} active={isSettings}>
              <span className="hidden-xs">Settings</span>
              <i className="visible-xs fal fa-fw fa-cogs" />
            </NavBarItem>
          ) : null}
          {isLoggedIn && isAdminUser ? (
            <NavBarItem aria-label="Navigate to admin page" href="/admin" onClick={() => goto("admin")} active={isSettingsSection}>
              <span className="hidden-xs">Admin</span>
              <i className="visible-xs fal fa-fw fa-users-cog" />
            </NavBarItem>
          ) : null}
        </ul>
        <ul className="nav-items-right">
          {!isLoggedIn && !isLoginModule ? (
            <NavBarItem aria-label="Login" href="/login" onClick={() => goto("login")}>
              <span className="hidden-xs">Login</span>
              <i className="visible-xs fal fa-fw fa-sign-in" />
            </NavBarItem>
          ) : null}
        </ul>
        {isLoggedIn ? (
          <ul className="nav-items-right">
            <NavBarItem aria-label="Logout" href="/logout" onClick={logout}>
              <span className="hidden-xs">Logout</span>
              <i className="visible-xs fal fa-fw fa-sign-out" />
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
          <button aria-label="Close menu" className="raw-button icon-button" onClick={onClose}>
            <i className="far fa-times"></i>
          </button>
          <h3>{title}</h3>
        </div>
        {children}
      </div>
    </div>,
    el
  );
};

export const MobileMenu = memo(_MobileMenu);
