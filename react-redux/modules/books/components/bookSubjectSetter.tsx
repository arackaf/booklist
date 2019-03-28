import React, { SFC, useState, useLayoutEffect, useContext, useRef } from "react";
import { buildMutation, useMutation } from "micro-graphql-react";

import updateBookSubjects from "graphQL/books/updateBookSubjects.graphql";

import BootstrapButton, { AjaxButton } from "applicationRoot/components/bootstrapButton";
import SelectAvailable from "applicationRoot/components/availableTagsOrSubjects";

import Modal from "applicationRoot/components/modal";
import { useStackedSubjects, filterSubjects } from "applicationRoot/subjectsState";

interface ILocalProps {
  modifyingBooks: any[];
  onDone: any;
  dispatch: any;
}

const BookSubjectSetter: SFC<ILocalProps> = props => {
  let setBooksSubjects = x => {};
  //const [booksState, { setBooksSubjects }] = useContext(BooksContext);
  const { subjectHash, subjectsUnwound } = useStackedSubjects();
  const [currentTab, setTab] = useState("subjects");
  const [addingSubjects, setAddingSubjects] = useState([]);
  const [removingSubjects, setRemovingSubjects] = useState([]);
  const resetSubjects = () => {
    setRemovingSubjects([]);
    setAddingSubjects([]);
  };

  useLayoutEffect(() => {
    if (props.modifyingBooks.length) {
      resetSubjects();
    }
  }, [props.modifyingBooks.length]);

  const { runMutation, running } = useMutation(buildMutation(updateBookSubjects));

  const save = () => {
    let args = { books: props.modifyingBooks.map(b => b._id), add: addingSubjects, remove: removingSubjects };
    Promise.resolve(runMutation(args)).then(() => {
      setBooksSubjects(args);
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
  const selectRef = useRef(null);

  return (
    <Modal className="fade" isOpen={!!modifyingBooks.length} onHide={props.onDone} headerCaption="Add / Remove Subjects:" focusRef={selectRef}>
      <div className="tab-headers">
        <div className={"tab-header " + (currentTab == "subjects" ? "active" : "")}>
          <a ref={selectRef} onClick={() => setTab("subjects")}>
            Choose subjects
          </a>
        </div>
        <div className={"tab-header " + (currentTab == "books" ? "active" : "")}>
          <a onClick={() => setTab("books")}>For books</a>
        </div>
      </div>
      <div className="tab-content">
        <div style={{ minHeight: "150px" }} className={"tab-pane " + (currentTab == "subjects" ? "active" : "")}>
          <br />
          <div style={{ position: "relative" }} className="row">
            <div className="col-xs-3">
              <SelectAvailable
                placeholder="Adding"
                items={subjectsUnwound}
                currentlySelected={addingSubjects}
                onSelect={subjectSelectedToAdd}
                filter={filterSubjects}
              />
            </div>
            <div className="col-xs-9">
              <div>
                {addingSubjects
                  .map(_id => subjectHash[_id])
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
                items={subjectsUnwound}
                currentlySelected={removingSubjects}
                onSelect={subjectSelectedToRemove}
                filter={filterSubjects}
              />
            </div>
            <div className="col-xs-9">
              <div>
                {removingSubjects
                  .map(_id => subjectHash[_id])
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
        <div style={{ minHeight: "150px" }} className={"tab-pane " + (currentTab == "books" ? "active" : "")}>
          <br />
          <ul style={{ fontSize: "14px", marginLeft: "10px" }}>
            {modifyingBooks.map(book => (
              <li key={book._id}>{book.title}</li>
            ))}
          </ul>
          <br />
        </div>
      </div>
      <AjaxButton preset="primary" running={running} runningText="Setting" onClick={save}>
        Set
      </AjaxButton>
      &nbsp;
      <BootstrapButton preset="" onClick={props.onDone}>
        Cancel
      </BootstrapButton>
    </Modal>
  );
};

export default BookSubjectSetter;
