import React, { Component } from "react";
import { connect } from "react-redux";
import { GraphQL, buildMutation } from "micro-graphql-react";

import updateBookSubjects from "graphQL/books/updateBookSubjects.graphql";

import BootstrapButton, { AjaxButton } from "applicationRoot/components/bootstrapButton";
import SelectAvailable from "applicationRoot/components/availableTagsOrSubjects";

import { SET_BOOKS_SUBJECTS } from "../reducers/books/actionNames";
import { filterSubjects, selectStackedSubjects } from "applicationRoot/rootReducer";
import Modal from "applicationRoot/components/modal";

interface ILocalProps {
  modifyingBooks: any[];
  onDone: any;
}

class BookSubjectSetter extends Component<ReturnType<typeof selectStackedSubjects> & ILocalProps & { dispatch: any }, any> {
  state = {
    currentTab: "subjects",
    addingSubjects: [],
    removingSubjects: []
  };

  componentDidUpdate(prevProps, prevState) {
    if (!(prevProps.modifyingBooks || []).length && (this.props.modifyingBooks || []).length) {
      this.setState({ addingSubjects: [], removingSubjects: [] });
    }
  }

  setBooksSubjects = runMutation => {
    let args = { books: this.props.modifyingBooks.map(b => b._id), add: this.state.addingSubjects, remove: this.state.removingSubjects };
    Promise.resolve(runMutation(args)).then(() => {
      this.props.dispatch({ type: SET_BOOKS_SUBJECTS, ...args });
      this.props.onDone();
    });
  };
  addingSubjectSet = (adding, { _id }) => {
    this.setState({
      addingSubjects: adding ? this.state.addingSubjects.concat(_id) : this.state.addingSubjects.filter(x => x != _id)
    });
  };
  subjectSelectedToAdd = this.addingSubjectSet.bind(null, true);

  removingSubjectSet = (adding, { _id }) => {
    this.setState({
      removingSubjects: adding ? this.state.removingSubjects.concat(_id) : this.state.removingSubjects.filter(x => x != _id)
    });
  };
  subjectSelectedToRemove = this.removingSubjectSet.bind(null, true);
  resetSubjects = () => {
    this.setState({
      addingSubjects: [],
      removingSubjects: []
    });
  };

  render() {
    let dontAddSubject = this.addingSubjectSet.bind(null, false);
    let dontRemoveSubject = this.removingSubjectSet.bind(null, false);
    let modifyingBooks = this.props.modifyingBooks || [];

    return (
      <Modal className="fade" isOpen={!!modifyingBooks.length} onHide={this.props.onDone} headerCaption="Add / Remove Subjects:">
        <GraphQL mutation={{ updateBookSubjects: buildMutation(updateBookSubjects) }}>
          {({ updateBookSubjects: { runMutation, running } }) => (
            <>
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
                        items={this.props.subjectsUnwound}
                        currentlySelected={this.state.addingSubjects}
                        onSelect={this.subjectSelectedToAdd}
                        filter={filterSubjects}
                      />
                    </div>
                    <div className="col-xs-9">
                      <div>
                        {this.state.addingSubjects
                          .map(_id => this.props.subjectHash[_id])
                          .map((s: any, i) => (
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
                        items={this.props.subjectsUnwound}
                        currentlySelected={this.state.removingSubjects}
                        onSelect={this.subjectSelectedToRemove}
                        filter={filterSubjects}
                      />
                    </div>
                    <div className="col-xs-9">
                      <div>
                        {this.state.removingSubjects
                          .map(_id => this.props.subjectHash[_id])
                          .map((s: any, i) => (
                            <span
                              key={i}
                              style={{ color: s.textColor || "white", backgroundColor: s.backgroundColor, display: "inline-table" }}
                              className="label label-default margin-left"
                            >
                              <a
                                onClick={() => dontRemoveSubject(s)}
                                style={{ color: s.textColor || "white", paddingRight: "5px", marginRight: "5px" }}
                              >
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
                    {modifyingBooks.map(book => (
                      <li key={book._id}>{book.title}</li>
                    ))}
                  </ul>
                  <br />
                </div>
              </div>
              <AjaxButton preset="primary" running={running} runningText="Setting" onClick={() => this.setBooksSubjects(runMutation)}>
                Set
              </AjaxButton>
              &nbsp;
              <BootstrapButton preset="" onClick={this.props.onDone}>
                Cancel
              </BootstrapButton>
            </>
          )}
        </GraphQL>
      </Modal>
    );
  }
}

// export default mutation(
//   ``
// )
export default connect(selectStackedSubjects)(BookSubjectSetter);
