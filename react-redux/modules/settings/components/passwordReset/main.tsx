import React, { Component } from "react";
import { connect } from "react-redux";
import { selector } from "../../reducers/publicUserSettings/reducer";
import * as actionCreators from "../../reducers/passwordReset/actionCreators";
import { AjaxButton } from "applicationRoot/components/bootstrapButton";

@connect(null, { ...actionCreators })
export default class PublicUserSettings extends Component<typeof actionCreators, any> {
  newPasswordEl: any;
  confirmPasswordEl: any;
  currentPasswordEl: any;
  state = { saving: false, mismatch: false, wrongPassword: false, saved: false };

  resetPassword = () => {
    if (this.newPasswordEl.value != this.confirmPasswordEl.value) {
      this.setState({ mismatch: true });
      return;
    }
    this.setState({ mismatch: false, saving: true, wrongPassword: false });
    Promise.resolve(this.props.resetPassword(this.currentPasswordEl.value, this.newPasswordEl.value)).then((res: any) => {
      if (res.error == 1) {
        this.setState({ wrongPassword: true });
      } else if (res.success) {
        this.setState({ saved: true });
        setTimeout(() => this.setState({ saved: false }), 2000);
      }
      this.setState({ saving: false });
    });
  };
  render() {
    return (
      <div className="row" style={{ position: "relative" }}>
        <div className="col-md-6 col-sm-12">
          <div style={{ padding: "10px" }}>
            <h2>Reset your password</h2>
            <div>
              <div className="form-group">
                <label htmlFor="existingPasswordInput">Current password</label>
                <input ref={el => (this.currentPasswordEl = el)} type="password" className="form-control" id="existingPasswordInput" />
              </div>
              <div className="form-group">
                <label htmlFor="newPasswordInput">New password</label>
                <input ref={el => (this.newPasswordEl = el)} type="password" className="form-control" id="newPasswordInput" />
              </div>
              <div className="form-group">
                <label htmlFor="confirmNewPasswordInput">Confirm new password</label>
                <input ref={el => (this.confirmPasswordEl = el)} type="password" className="form-control" id="confirmNewPasswordInput" />
              </div>
            </div>
            <AjaxButton onClick={this.resetPassword} disabled={this.state.saved} running={this.state.saving} runningText="Saving" preset="primary">
              Save
            </AjaxButton>
            {this.state.mismatch ? (
              <div>
                <br />
                <div className="alert alert-danger">Passwords must match</div>
              </div>
            ) : null}
            {this.state.wrongPassword ? (
              <div>
                <br />
                <div className="alert alert-danger">Your existing password does not match</div>
              </div>
            ) : null}
            {this.state.saved ? (
              <div>
                <br />
                <div className="alert alert-success">Your password has been updated</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
