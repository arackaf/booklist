import React, { Component } from "react";
import Modal from "simple-react-bootstrap/lib/modal";
import { selectSearchVals } from "../../reducers/search/reducer";
import SelectAvailable from "applicationRoot/components/availableTagsOrSubjects";
import BootstrapButton from "applicationRoot/components/bootstrapButton";
import { RemovableLabelDisplay } from "applicationRoot/components/labelDisplay";
import { createSelector } from "reselect";
import { selectEntireTagsState, selectStackedSubjects, filterTags, filterSubjects } from "applicationRoot/rootReducer";

const selector = createSelector(selectSearchVals, selectEntireTagsState, selectStackedSubjects, (searchState, tagsState, subjectsState) => {
  return {
    ...searchState,
    tagHash: tagsState.tagHash,
    allTagsSorted: tagsState.allTagsSorted,
    subjectHash: subjectsState.subjectHash,
    subjectsUnwound: subjectsState.subjectsUnwound
  };
});

export default class SearchModal extends Component<{ isOpen: boolean; onHide: any } & ReturnType<typeof selector>, any> {
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
      <Modal className="fade" show={isOpen} onHide={onHide}>
        <Modal.Header>
          <button type="button" className="close" onClick={onHide} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 className="modal-title">Search your books</h4>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.applyFilters}>
            <div className="row">
              <div className="col-xs-6">
                <div className="form-group">
                  <label>Title</label>
                  <input defaultValue={this.props.title} ref={el => (this.searchEl = el)} placeholder="Search title" className="form-control" />
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
              <SelectAvailable
                placeholder="Tags"
                items={this.props.allTagsSorted}
                currentlySelected={this.state.tags}
                onSelect={this.selectTag}
                filter={filterTags}
              />
            </div>
            <div className="col-xs-9">
              <div>
                {this.state.tags.map(_id => this.props.tagHash[_id]).map(t => (
                  <RemovableLabelDisplay key={t._id} className="margin-left" item={t} doRemove={() => this.removeTag(t)} />
                ))}
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
                <input type="checkbox" ref={el => (this.childSubEl = el)} defaultChecked={!!this.props.searchChildSubjects} /> Also search child
                subjects
              </label>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <BootstrapButton preset="primary" className="pull-left" onClick={this.applyFilters}>
            Filter
          </BootstrapButton>
          <BootstrapButton preset="default" onClick={onHide}>
            Close
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    );
  }
}
