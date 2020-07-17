import React, { Component, useContext } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import { AppContext } from "app/renderUI";
import { SET_THEME } from "app/state/appState";

import DemoStyles from "./demoStyles";
import Stack from "app/components/layout/Stack";

const { themeChooserRoot, themeChooserList, themeChooserItem, themeChooser } = styles;

const numThemes = 17;

const themeNames = Array.from({ length: numThemes }, (v, i) => `scheme${i + 1}`);
const arrayOfTen = Array.from({ length: 10 }, (v, i) => i + 1);

const ThemeChooser = props => {
  const [{ colorTheme }, actions, dispatch] = useContext(AppContext);
  return (
    <div className={themeChooserRoot}>
      <div className={themeChooserList}>
        {themeNames.map((name, index) => (
          <>
            <Stack onClick={() => dispatch({ type: SET_THEME, theme: name })} className={classNames(themeChooserItem, { active: colorTheme == name })} tightest={true}>
              <div className={classNames(name, themeChooser)}>
                {arrayOfTen.map(val => (
                  <div style={{ backgroundColor: `var(--primary-${val})` }} />
                ))}
              </div>
            </Stack>
          </>
        ))}
      </div>
      <div>
        <DemoStyles />
      </div>
    </div>
  );
};

export default ThemeChooser;
