export const resetPassword = (oldPassword, newPassword) => dispatch => {
    return ajaxUtil.post('/user/resetPassword', {oldPassword, newPassword}, resp => { });
}