import React, { Component } from "react";
import { selectSearchVals } from "../../reducers/search/reducer";
import SelectAvailable from "applicationRoot/components/availableTagsOrSubjects";
import BootstrapButton from "applicationRoot/components/bootstrapButton";
import { RemovableLabelDisplay } from "applicationRoot/components/labelDisplay";
import { createSelector } from "reselect";
import { selectStackedSubjects, filterSubjects } from "applicationRoot/rootReducer";
import { connect } from "react-redux";
import SelectAvailableTags from "applicationRoot/components/selectAvailableTags";

import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { Transition, config } from "react-spring";
import DisplaySelectedTags from "applicationRoot/components/displaySelectedTags";

const selector = createSelector(selectSearchVals, selectStackedSubjects, (searchState, subjectsState) => {
  return {
    ...searchState,
    subjectHash: subjectsState.subjectHash,
    subjectsUnwound: subjectsState.subjectsUnwound
  };
});

@connect(selector)
export default class SearchModal extends Component<Partial<{ isOpen: boolean; onHide: any } & ReturnType<typeof selector>>, any> {
  state = {
    subjects: this.props.selectedSubjects,
    tags: this.props.selectedTags
  };
  selectSubject = subject => this.setState(state => ({ subjects: state.subjects.concat(subject._id) }));
  selectTag = tag => this.setState(state => ({ tags: state.tags.concat(tag._id) }));
  removeSubject = subject => this.setState(state => ({ subjects: state.subjects.filter(_id => _id != subject._id) }));
  removeTag = tag => this.setState(state => ({ tags: state.tags.filter(_id => _id != tag._id) }));

  searchEl: any;
  childSubEl: any;
  isReadE: any;
  isRead0: any;
  isRead1: any;
  applyFilters = () => {};
  render() {
    let { isOpen, onHide } = this.props;
    return (
      <Transition
        config={{ ...config.gentle, overshootClamping: true }}
        from={{ opacity: 0, y: -10 }}
        enter={{ opacity: 1, y: 0 }}
        leave={{ opacity: 0, y: 10 }}
      >
        {isOpen
          ? styles => (
              <DialogOverlay onDismiss={onHide} isOpen={isOpen} style={{ opacity: styles.opacity }}>
                <DialogContent
                  style={{
                    transform: `translate3d(0px, ${styles.y}px, 0px)`,
                    border: "4px solid hsla(0, 0%, 0%, 0.5)",
                    borderRadius: 10
                  }}
                >
                  <button type="button" className="close" onClick={onHide} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 className="modal-title">Search your books</h4>
                  <hr />
                  <form onSubmit={this.applyFilters}>
                    <div className="row">
                      <div className="col-xs-6">
                        <div className="form-group">
                          <label>Title</label>
                          <input
                            defaultValue={this.props.title}
                            ref={el => (this.searchEl = el)}
                            placeholder="Search title"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="col-xs-6">
                        <div className="form-group">
                          <label>Is read?</label>
                          <br />
                          <div style={{ display: "inline" }} className="radio">
                            <label>
                              <input type="radio" defaultChecked={this.props.isRead == ""} ref={el => (this.isReadE = el)} name="isRead" />
                              Either
                            </label>
                          </div>
                          <div style={{ display: "inline", marginLeft: "20px" }} className="radio">
                            <label>
                              <input type="radio" defaultChecked={this.props.isRead == "1"} name="isRead" />
                              Yes
                            </label>
                          </div>
                          <div style={{ display: "inline", marginLeft: "20px" }} className="radio">
                            <label>
                              <input type="radio" defaultChecked={this.props.isRead == "0"} ref={el => (this.isRead0 = el)} name="isRead" />
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button style={{ display: "none" }} />
                    <input type="submit" style={{ display: "inline", visibility: "hidden" }} />
                  </form>
                  <div className="row" style={{ position: "relative" }}>
                    <div className="col-xs-3">
                      <SelectAvailableTags currentlySelected={this.state.tags} onSelect={this.selectTag} />
                    </div>
                    <div className="col-xs-9">
                      <div>
                        <DisplaySelectedTags currentlySelected={this.state.tags} onRemove={this.removeTag} />
                      </div>
                    </div>
                  </div>
                  <br />
                  <>
                    <div className="row" style={{ position: "relative" }}>
                      <div className="col-xs-3">
                        <SelectAvailable
                          placeholder="Subjects"
                          items={this.props.subjectsUnwound}
                          currentlySelected={this.state.subjects}
                          onSelect={this.selectSubject}
                          filter={filterSubjects}
                        />
                      </div>
                      <div className="col-xs-9">
                        <div>
                          {this.state.subjects.map(_id => this.props.subjectHash[_id]).map(s => (
                            <RemovableLabelDisplay key={s._id} className="margin-left" item={s} doRemove={() => this.removeSubject(s)} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="checkbox">
                      <label>
                        <input type="checkbox" ref={el => (this.childSubEl = el)} defaultChecked={!!this.props.searchChildSubjects} /> Also search
                        child subjects
                      </label>
                    </div>
                  </>
                  <hr />
                  <BootstrapButton preset="primary" className="pull-left" onClick={this.applyFilters}>
                    Filter
                  </BootstrapButton>
                  &nbsp;
                  <BootstrapButton preset="default" onClick={onHide}>
                    Close
                  </BootstrapButton>
                </DialogContent>
              </DialogOverlay>
            )
          : null}
      </Transition>
    );
  }
}
