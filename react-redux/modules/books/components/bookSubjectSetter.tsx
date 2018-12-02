import React, { Component, SFC, useState, useLayoutEffect } from "react";
import { connect } from "react-redux";
import { GraphQL, buildMutation, useMutation } from "micro-graphql-react";

import updateBookSubjects from "graphQL/books/updateBookSubjects.graphql";

import BootstrapButton, { AjaxButton } from "applicationRoot/components/bootstrapButton";
import SelectAvailable from "applicationRoot/components/availableTagsOrSubjects";

import { SET_BOOKS_SUBJECTS } from "../reducers/books/actionNames";
import { filterSubjects, selectStackedSubjects } from "applicationRoot/rootReducer";
import Modal from "applicationRoot/components/modal";

interface ILocalProps {
  modifyingBooks: any[];
  onDone: any;
  dispatch: any;
}

const BookSubjectSetter: SFC<ReturnType<typeof selectStackedSubjects> & ILocalProps> = props => {
  const [currentTab, setTab] = useState("subjects");
  const [addingSubjects, setAddingSubjects] = useState([]);
  const [removingSubjects, setRemovingSubjects] = useState([]);
  const resetSubjects = () => {
    setRemovingSubjects([]);
    setAddingSubjects([]);
  };

  useLayoutEffect(
    () => {
      if (props.modifyingBooks.length) {
        resetSubjects();
      }
    },
    [props.modifyingBooks.length]
  );

  const { runMutation, running } = useMutation(buildMutation(updateBookSubjects));

  const setBooksSubjects = () => {
    let args = { books: props.modifyingBooks.map(b => b._id), add: addingSubjects, remove: removingSubjects };
    Promise.resolve(runMutation(args)).then(() => {
      props.dispatch({ type: SET_BOOKS_SUBJECTS, ...args });
      props.onDone();
    });
  };
  const addingSubjectSet = (adding, { _id }) => setAddingSubjects(adding ? addingSubjects.concat(_id) : addingSubjects.filter(x => x != _id));
  const subjectSelectedToAdd = addingSubjectSet.bind(null, true);

  const removingSubjectSet = (adding, { _id }) => setRemovingSubjects(adding ? removingSubjects.concat(_id) : removingSubjects.filter(x => x != _id));
  const subjectSelectedToRemove = removingSubjectSet.bind(null, true);

  const dontAddSubject = addingSubjectSet.bind(null, false);
  const dontRemoveSubject = removingSubjectSet.bind(null, false);
  const modifyingBooks = props.modifyingBooks || [];

  return (
    <Modal className="fade" isOpen={!!modifyingBooks.length} onHide={props.onDone} headerCaption="Add / Remove Subjects:">
      <ul className="nav nav-tabs">
        <li className={currentTab == "subjects" ? "active" : ""}>
          <a onClick={() => setTab("subjects")}>Choose subjects</a>
        </li>
        <li className={currentTab == "books" ? "active" : ""}>
          <a onClick={() => setTab("books")}>For books</a>
        </li>
      </ul>
      <div className="tab-content">
        <div style={{ minHeight: "150px" }} className={"tab-pane " + (currentTab == "subjects" ? "active in" : "")}>
          <br />
          <div style={{ position: "relative" }} className="row">
            <div className="col-xs-3">
              <SelectAvailable
                placeholder="Adding"
                items={props.subjectsUnwound}
                currentlySelected={addingSubjects}
                onSelect={subjectSelectedToAdd}
                filter={filterSubjects}
              />
            </div>
            <div className="col-xs-9">
              <div>
                {addingSubjects
                  .map(_id => props.subjectHash[_id])
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
                items={props.subjectsUnwound}
                currentlySelected={removingSubjects}
                onSelect={subjectSelectedToRemove}
                filter={filterSubjects}
              />
            </div>
            <div className="col-xs-9">
              <div>
                {removingSubjects
                  .map(_id => props.subjectHash[_id])
                  .map((s: any, i) => (
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
          <BootstrapButton onClick={resetSubjects} className="pull-right" preset="default-xs">
            Reset subjects
          </BootstrapButton>
          <br style={{ clear: "both" }} />
        </div>
        <div style={{ minHeight: "150px" }} className={"tab-pane " + (currentTab == "books" ? "active in" : "")}>
          <br />
          <ul className="list-unstyled" style={{ marginLeft: "10px" }}>
            {modifyingBooks.map(book => (
              <li key={book._id}>{book.title}</li>
            ))}
          </ul>
          <br />
        </div>
      </div>
      <AjaxButton preset="primary" running={running} runningText="Setting" onClick={setBooksSubjects}>
        Set
      </AjaxButton>
      &nbsp;
      <BootstrapButton preset="" onClick={props.onDone}>
        Cancel
      </BootstrapButton>
    </Modal>
  );
};

export default connect(selectStackedSubjects)(BookSubjectSetter);
