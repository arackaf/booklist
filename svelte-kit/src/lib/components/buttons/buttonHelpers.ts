const cssPresets: any = {};
const buttonTypes = ["default", "primary", "success", "info", "warning", "danger"];
const buttonSizes = ["lg", "sm", "xs"];

buttonTypes.forEach(t => {
  cssPresets[t] = `btn-${t}`; //default size
  buttonSizes.forEach(s => {
    cssPresets[`${t}-${s}`] = `btn-${t} btn-${s}`;
  });
});

export const cssFromPreset = (preset: string, className: string) => (className || "") + " btn " + (cssPresets[preset] || "");
