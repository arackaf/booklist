import React, { useContext } from "react";
import classNames from "classnames";
import { AppContext } from "app/renderUI";
import { SET_THEME, SET_WHITE_BG } from "app/state/appState";

import DemoStyles from "./demoStyles";
import Stack from "app/components/layout/Stack";

import "./styles.scss";

const numThemes = 17;

const themeNames = Array.from({ length: numThemes }, (v, i) => `scheme${i + 1}`);
const arrayOfTen = Array.from({ length: 10 }, (v, i) => i + 1);

const ThemeChooser = props => {
  const [{ colorTheme, whiteBackground }, actions, dispatch] = useContext(AppContext);
  return (
    <div className="theme-chooser-root">
      <div className="theme-chooser-list">
        <label style={{ fontSize: "16px" }} className="checkbox margin-bottom">
          <input checked={whiteBackground == "1"} onChange={evt => dispatch({ type: SET_WHITE_BG, value: evt.target.checked })} type="checkbox" />
          White background
        </label>
        {themeNames.map((name, index) => (
          <>
            <Stack
              onClick={() => dispatch({ type: SET_THEME, theme: name })}
              className={classNames("theme-chooser-item", { active: colorTheme == name })}
              tightest={true}
            >
              <div className={classNames(name, "theme-chooser")}>
                {arrayOfTen.map(val => (
                  <div style={{ backgroundColor: `var(--primary-${val})` }} />
                ))}
              </div>
            </Stack>
          </>
        ))}
      </div>
      <div className="demo-container">
        <DemoStyles />
      </div>
    </div>
  );
};

export default ThemeChooser;
