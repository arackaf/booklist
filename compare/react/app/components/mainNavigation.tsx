import React, { FunctionComponent } from "react";
import ajaxUtil from "util/ajaxUtil";
import navClasses from "css/navbar.module.css";

const { nav, navHeader, navItems } = navClasses;

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
    localStorage.setItem("reduxState", "");
    ajaxUtil.post("/react/logout", {}, () => window.location.reload());
  };

  return (
    <div className={nav} style={{ marginBottom: "5px" }}>
      <div className={`${navHeader} hidden-xs`}>
        <a>
          <i className="fal fa-book" style={{ marginRight: "5px" }} />
          <span>My Library</span>
        </a>
      </div>

      <ul className={navItems}>
        <NavBarItem className="visible-xs" disabled={true} active={false} aStyle={{ marginTop: "2px" }}>
          <i className="fal fa-home visible-xs" />
        </NavBarItem>
        <NavBarItem disabled={true} active={false}>
          <span className="hidden-xs">Book entry</span>
          <i className="visible-xs fal fa-scanner" />
        </NavBarItem>
        <NavBarItem disabled={false} active={true}>
          <span className="hidden-xs">Books</span>
          <i className="visible-xs fal fa-books" />
        </NavBarItem>
        <NavBarItem disabled={true} active={false}>
          <span className="hidden-xs">Subjects</span>
          <i className="visible-xs fal fa-sitemap" />
        </NavBarItem>
        <NavBarItem disabled={true} active={false}>
          <span className="hidden-xs">Settings</span>
          <i className="visible-xs fal fa-cogs" />
        </NavBarItem>
        <NavBarItem disabled={true} active={false}>
          <span className="hidden-xs">Admin</span>
          <i className="visible-xs fal fa-users-cog" />
        </NavBarItem>
      </ul>
    </div>
  );
};

export default MainNavigationBar;
