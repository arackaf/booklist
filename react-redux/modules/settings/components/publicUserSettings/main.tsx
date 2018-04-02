import React, { Component } from "react";
import { connect } from "react-redux";
import { selector, publicUserSettingsSelectorType } from "../../reducers/publicUserSettings/reducer";
import * as actionCreators from "../../reducers/publicUserSettings/actionCreators";
import { SectionLoading } from "applicationRoot/components/loading";
import { AjaxButton } from "applicationRoot/components/bootstrapButton";

const styleTwenty: any = { left: "20%" };

@connect(selector, { ...actionCreators })
export default class PublicUserSettings extends Component<publicUserSettingsSelectorType & typeof actionCreators, any> {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6 col-sm-12" style={{ position: "relative", minHeight: "200px" }}>
            {this.props.loading ? (
              <SectionLoading style={styleTwenty} />
            ) : (
              <div style={{ padding: "10px" }}>
                {this.props.publicLink ? (
                  <div className="panel panel-default" style={{ padding: "10px" }}>
                    Your collection is currently public, viewable at <br />
                    <br />
                    <a target="_blank" href={this.props.publicLink}>
                      {this.props.publicLink}
                    </a>
                  </div>
                ) : null}
                <div className="form-group">
                  <label className="checkbox">
                    Allow your book collection to be viewed publicly?{" "}
                    <input
                      checked={this.props.editing.isPublic}
                      disabled={this.props.saving}
                      onChange={this.props.editIsPublic}
                      style={{ marginLeft: "5px" }}
                      type="checkbox"
                    />
                  </label>
                </div>
                {this.props.editing.isPublic ? (
                  <div style={{ marginLeft: "20px" }}>
                    <div className="form-group">
                      <label htmlFor="publicNameInput">Publicly display your name as</label>
                      <input
                        value={this.props.editing.publicName}
                        disabled={this.props.saving}
                        onChange={this.props.editPublicName}
                        className="form-control"
                        id="publicNameInput"
                        placeholder="Public name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="publicBooksHeader">Publicly display your name as</label>
                      <input
                        value={this.props.editing.publicBooksHeader}
                        disabled={this.props.saving}
                        onChange={this.props.editPublicBooksHeader}
                        className="form-control"
                        id="publicBooksHeader"
                        placeholder="Book header"
                      />
                    </div>
                    <div className="alert alert-info" role="alert">
                      This is what will show in the navigation when people view your book collection. Leave it blank to default to [public name]'s
                      Books. See below
                    </div>
                    <img src="/react-redux/static/publicBookHeaderInfo.png" />
                  </div>
                ) : null}
                <AjaxButton
                  disabled={!this.props.isDirty || !this.props.editing.publicName}
                  onClick={this.props.savePublicInfo}
                  running={this.props.saving}
                  runningText="Saving"
                  preset="primary"
                >
                  Save
                </AjaxButton>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
