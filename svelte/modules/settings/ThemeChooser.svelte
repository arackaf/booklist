<script lang="ts">
  import classNames from "classnames";
  import { appState, dispatch, SET_THEME, SET_WHITE_BG } from "app/state/appState";

  import Stack from "app/components/layout/Stack.svelte";
  import DemoStyles from "./DemoStyles.svelte";

  import "./theme-chooser.scss";

  const numThemes = 17;
  const themeNames = Array.from({ length: numThemes }, (v, i) => `scheme${i + 1}`);
  const arrayOfTen = Array.from({ length: 10 }, (v, i) => i + 1);

  $: ({ colorTheme, whiteBackground } = $appState);

  const setWhiteBackground = evt => {
    dispatch({ type: SET_WHITE_BG, value: evt.target.checked });
  };
</script>

<div class="theme-chooser-root">
  <div class="theme-chooser-list">
    <label style="font-size: 16px" class="checkbox margin-bottom">
      <input type="checkbox" checked={whiteBackground == "1"} on:change={setWhiteBackground} />
      White background
    </label>
    {#each themeNames as name}
      <Stack
        on:click={() => dispatch({ type: SET_THEME, theme: name })}
        class={classNames("theme-chooser-item", { active: colorTheme == name })}
        tightest={true}
      >
        <div class={classNames(name, "theme-chooser")}>
          {#each arrayOfTen as val}
            <div style={`background-color: var(--primary-${val})`} />
          {/each}
        </div>
      </Stack>
    {/each}
  </div>
  <div class="demo-container">
    <DemoStyles />
  </div>
</div>
