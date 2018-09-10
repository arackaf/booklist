import React, { Component } from "react";
import { connect } from "react-redux";

import Modal from "applicationRoot/components/modal";
import BootstrapButton from "applicationRoot/components/bootstrapButton";
import SelectAvailableTags from "applicationRoot/components/selectAvailableTags";
import DisplaySelectedTags from "applicationRoot/components/displaySelectedTags";
import SelectAvailableSubjects from "applicationRoot/components/selectAvailableSubjects";
import DisplaySelectedSubjects from "applicationRoot/components/displaySelectedSubjects";

import { selectSearchVals } from "../../reducers/search/reducer";
import { booksSearch } from "../../reducers/search/actionCreators";

interface LocalProps {
  isOpen: boolean;
  onHide: any;
}

@connect(
  selectSearchVals,
  { booksSearch }
)
export default class SearchModal extends Component<Partial<LocalProps & ReturnType<typeof selectSearchVals> & { booksSearch }>, any> {
  state = { subjects: [], tags: [] };
  componentDidUpdate(prevProps) {
    if (this.props.isOpen && !prevProps.isOpen) {
      this.setState({
        subjects: this.props.subjects,
        tags: this.props.tags
      });
    }
  }
  selectSubject = subject => this.setState(state => ({ subjects: state.subjects.concat(subject._id) }));
  selectTag = tag => this.setState(state => ({ tags: state.tags.concat(tag._id) }));
  removeSubject = subject => this.setState(state => ({ subjects: state.subjects.filter(_id => _id != subject._id) }));
  removeTag = tag => this.setState(state => ({ tags: state.tags.filter(_id => _id != tag._id) }));

  searchEl: any;
  childSubEl: any;
  isReadE: any;
  isRead0: any;
  isRead1: any;
  applyFilters = () => {
    this.props.booksSearch({
      title: this.searchEl.value,
      isRead: this.isReadE.checked ? "" : this.isRead0.checked ? 0 : 1,
      subjects: this.state.subjects,
      tags: this.state.tags,
      searchChildSubjects: this.childSubEl.checked
    });
  };
  render() {
    let { isOpen, onHide } = this.props;
    return (
      <Modal {...{ isOpen, onHide, headerCaption: "Search your books" }}>
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
              <SelectAvailableSubjects currentlySelected={this.state.subjects} onSelect={this.selectSubject} />
            </div>
            <div className="col-xs-9">
              <div>
                <DisplaySelectedSubjects currentlySelected={this.state.subjects} onRemove={this.removeSubject} />
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
        <hr />
        <BootstrapButton preset="primary" className="pull-left" onClick={this.applyFilters}>
          Filter
        </BootstrapButton>
        &nbsp;
        <BootstrapButton preset="default" onClick={onHide}>
          Close
        </BootstrapButton>
      </Modal>
    );
  }
}
