import ajaxUtil from "util/ajaxUtil";

export const resetPassword = (oldPassword, newPassword) => dispatch => {
  return ajaxUtil.post("/react-redux/resetPassword", { oldPassword, newPassword }, resp => {});
};
