import React, { Component } from "react";
import { connect } from "react-redux";

import BootstrapButton, { AjaxButton } from "applicationRoot/components/bootstrapButton";
import { Modal } from "simple-react-bootstrap";
import GenericLabelSelect from "applicationRoot/components/genericLabelSelect";
import SelectAvailable from "./availableTagsOrSubjects";

import { setBooksSubjects } from "modules/books/reducers/books/actionCreators";
import { filterSubjects } from "modules/books/reducers/subjects/reducer";
import { selectStackedSubjects, StackedSubjectsType } from "modules/books/reducers/subjects/reducer";
const { createSelector } = require("reselect");

interface ILocalProps {
  modifyingBooks: any[];
  onDone: any;
}

@connect(selectStackedSubjects, { setBooksSubjects })
export default class BookSubjectSetter extends Component<StackedSubjectsType & { setBooksSubjects } & ILocalProps, any> {
  state = {
    currentTab: "subjects",
    addingSubjects: [],
    removingSubjects: [],
    addingSubjectSearch: "",
    removingSubjectSearch: "",
    saving: false
  };

  setBooksSubjects = () => {
    this.setState({ saving: true });
    Promise.resolve(
      this.props.setBooksSubjects(this.props.modifyingBooks.map(b => b._id), this.state.addingSubjects, this.state.removingSubjects)
    ).then(() => {
      this.setState({ saving: false });
      this.props.onDone();
    });
  };
  addingSubjectSet = (adding, { _id }) => {
    this.setState({
      addingSubjects: adding ? this.state.addingSubjects.concat(_id) : this.state.addingSubjects.filter(x => x != _id),
      addingSubjectSearch: adding ? "" : this.state.addingSubjectSearch
    });
  };
  subjectSelectedToAdd = this.addingSubjectSet.bind(null, true);

  removingSubjectSet = (adding, { _id }) => {
    this.setState({
      removingSubjects: adding ? this.state.removingSubjects.concat(_id) : this.state.removingSubjects.filter(x => x != _id),
      removingSubjectSearch: adding ? "" : this.state.removingSubjectSearch
    });
  };
  subjectSelectedToRemove = this.removingSubjectSet.bind(null, true);
  resetSubjects = () => {
    this.setState({
      addingSubjects: [],
      removingSubjects: []
    });
  };
  setAddingSearchVal = val => this.setState({ addingSubjectSearch: val });
  setRemovingSearchVal = val => this.setState({ removingSubjectSearch: val + "" });

  render() {
    let dontAddSubject = this.addingSubjectSet.bind(null, false),
      dontRemoveSubject = this.removingSubjectSet.bind(null, false);

    return (
      <Modal className="fade" show={!!this.props.modifyingBooks.length} onHide={this.props.onDone}>
        <Modal.Header>
          <button type="button" className="close" onClick={this.props.onDone} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 className="modal-title">Add / Remove Subjects:</h4>
        </Modal.Header>
        <Modal.Body>
          <ul className="nav nav-tabs">
            <li className={this.state.currentTab == "subjects" ? "active" : ""}>
              <a onClick={() => this.setState({ currentTab: "subjects" })}>Choose subjects</a>
            </li>
            <li className={this.state.currentTab == "books" ? "active" : ""}>
              <a onClick={() => this.setState({ currentTab: "books" })}>For books</a>
            </li>
          </ul>
          <div className="tab-content">
            <div style={{ minHeight: "150px" }} className={"tab-pane " + (this.state.currentTab == "subjects" ? "active in" : "")}>
              <br />
              <div style={{ position: "relative" }} className="row">
                <div className="col-xs-3">
                  <SelectAvailable
                    placeholder="Adding"
                    search={this.state.addingSubjectSearch}
                    onSearchChange={this.setAddingSearchVal}
                    items={this.props.subjectsUnwound}
                    currentlySelected={this.state.addingSubjects}
                    onSelect={this.subjectSelectedToAdd}
                    filter={filterSubjects}
                  />
                </div>
                <div className="col-xs-9">
                  <div>
                    {this.state.addingSubjects.map(_id => this.props.subjectHash[_id]).map((s: any, i) => (
                      <span
                        key={i}
                        style={{ color: s.textColor || "white", backgroundColor: s.backgroundColor, display: "inline-table" }}
                        className="label label-default margin-left"
                      >
                        <a onClick={() => dontAddSubject(s)} style={{ color: s.textColor || "white", paddingRight: "5px", marginRight: "5px" }}>
                          X
                        </a>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <br />

              <div style={{ position: "relative" }} className="row">
                <div className="col-xs-3">
                  <SelectAvailable
                    placeholder="Removing"
                    search={this.state.removingSubjectSearch}
                    onSearchChange={this.setRemovingSearchVal}
                    items={this.props.subjectsUnwound}
                    currentlySelected={this.state.removingSubjects}
                    onSelect={this.subjectSelectedToRemove}
                    filter={filterSubjects}
                  />
                </div>
                <div className="col-xs-9">
                  <div>
                    {this.state.removingSubjects.map(_id => this.props.subjectHash[_id]).map((s: any, i) => (
                      <span
                        key={i}
                        style={{ color: s.textColor || "white", backgroundColor: s.backgroundColor, display: "inline-table" }}
                        className="label label-default margin-left"
                      >
                        <a onClick={() => dontRemoveSubject(s)} style={{ color: s.textColor || "white", paddingRight: "5px", marginRight: "5px" }}>
                          X
                        </a>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <br />
              <BootstrapButton onClick={this.resetSubjects} className="pull-right" preset="default-xs">
                Reset subjects
              </BootstrapButton>
              <br style={{ clear: "both" }} />
            </div>
            <div style={{ minHeight: "150px" }} className={"tab-pane " + (this.state.currentTab == "books" ? "active in" : "")}>
              <br />
              <ul className="list-unstyled" style={{ marginLeft: "10px" }}>
                {this.props.modifyingBooks.map(book => <li key={book._id}>{book.title}</li>)}
              </ul>
              <br />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <AjaxButton preset="primary" running={this.state.saving} runningText="Setting" onClick={this.setBooksSubjects}>
            Set
          </AjaxButton>
          <BootstrapButton preset="" onClick={this.props.onDone}>
            Cancel
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    );
  }
}
