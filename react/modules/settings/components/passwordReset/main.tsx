import React, { Component, useState, useRef, useContext } from "react";
import { AjaxButton } from "app/components/bootstrapButton";
import ajaxUtil from "util/ajaxUtil";
import { AppContext } from "app/renderUI";
import FlexRow from "app/components/layout/FlexRow";
import Stack from "app/components/layout/Stack";

const exectueResetPassword = (oldPassword, newPassword) => {
  return ajaxUtil.post("/react/resetPassword", { oldPassword, newPassword }, resp => {});
};

const PublicUserSettings = props => {
  const [{ online }] = useContext(AppContext);
  const newPasswordEl = useRef(null);
  const confirmPasswordEl = useRef(null);
  const currentPasswordEl = useRef(null);
  const [saving, setSaving] = useState(false);
  const [mismatch, setMismatch] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const resetPassword = () => {
    if (newPasswordEl.current.value != confirmPasswordEl.current.value) {
      setMismatch(true);
      return;
    }

    setMismatch(false);
    setSaving(true);
    setWrongPassword(false);

    Promise.resolve(exectueResetPassword(currentPasswordEl.current.value, newPasswordEl.current.value)).then((res: any) => {
      if (res.error == 1) {
        setWrongPassword(true);
      } else if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
      setSaving(false);
    });
  };

  if (!online) {
    return <h1>Offline</h1>;
  }

  return (
    <div className="margin-top">
      <FlexRow>
        <div className="col-md-6 col-sm-12">
          <Stack>
            <div className="form-group">
              <label htmlFor="existingPasswordInput">Current password</label>
              <input ref={currentPasswordEl} type="password" className="form-control" id="existingPasswordInput" />
            </div>
            <div className="form-group">
              <label htmlFor="newPasswordInput">New password</label>
              <input ref={newPasswordEl} type="password" className="form-control" id="newPasswordInput" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPasswordInput">Confirm new password</label>
              <input ref={confirmPasswordEl} type="password" className="form-control" id="confirmNewPasswordInput" />
            </div>
            <AjaxButton
              style={{ alignSelf: "flex-start" }}
              onClick={resetPassword}
              disabled={saved}
              running={saving}
              runningText="Saving"
              preset="primary"
            >
              Save
            </AjaxButton>
            {mismatch ? (
              <div>
                <br />
                <div className="alert alert-danger">Passwords must match</div>
              </div>
            ) : null}
            {wrongPassword ? (
              <div>
                <br />
                <div className="alert alert-danger">Your existing password does not match</div>
              </div>
            ) : null}
            {saved ? (
              <div>
                <br />
                <div className="alert alert-success">Your password has been updated</div>
              </div>
            ) : null}
          </Stack>
        </div>
      </FlexRow>
    </div>
  );
};

export default PublicUserSettings;
