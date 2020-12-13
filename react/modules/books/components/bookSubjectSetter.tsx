import React, { SFC, useState, useLayoutEffect, useContext, useRef, FunctionComponent } from "react";
import { useMutation } from "micro-graphql-react";

import updateBookSubjects from "graphQL/books/updateBookSubjects.graphql";

import { Button, ActionButton } from "app/components/ui/Button";

import Modal from "app/components/ui/Modal";
import { useStackedSubjects } from "app/state/subjectsState";
import { MutationOf, Mutations } from "graphql-typings";
import FlexRow from "app/components/layout/FlexRow";
import Stack from "app/components/layout/Stack";
import FlowItems from "app/components/layout/FlowItems";
import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "app/components/layout/Tabs";
import DisplaySelectedSubjects from "app/components/subjectsAndTags/subjects/DisplaySelectedSubjects";
import SelectAvailableSubjects from "app/components/subjectsAndTags/subjects/SelectAvailableSubjects";

interface ILocalProps {
  modifyingBooks: any[];
  onDone: any;
}

const BookSubjectSetter: FunctionComponent<ILocalProps> = props => {
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

  const { runMutation, running } = useMutation<MutationOf<Mutations["updateBooks"]>>(updateBookSubjects);

  const save = () => {
    let args = { books: props.modifyingBooks.map(b => b._id), add: addingSubjects, remove: removingSubjects };
    return Promise.resolve(runMutation(args)).then(() => {
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
    <Modal
      className="fade"
      isOpen={!!modifyingBooks.length}
      onHide={() => {
        props.onDone();
      }}
      headerCaption="Add / Remove Subjects:"
      focusRef={selectRef}
    >
      <Tabs defaultTab="subjects">
        <TabHeaders>
          <TabHeader tabName="subjects">
            <a ref={selectRef}>Choose subjects</a>
          </TabHeader>
          <TabHeader tabName="books">
            <a>For books</a>
          </TabHeader>
        </TabHeaders>
        <TabContents>
          <TabContent tabName="subjects">
            <FlexRow>
              <div className="col-xs-3">
                <SelectAvailableSubjects placeholder="Adding" currentlySelected={addingSubjects} onSelect={subjectSelectedToAdd} />
              </div>
              <div className="col-xs-9" style={{ display: "flex", flexWrap: "wrap" }}>
                <DisplaySelectedSubjects currentlySelected={addingSubjects} onRemove={dontAddSubject} />
              </div>

              <div className="col-xs-3">
                <SelectAvailableSubjects placeholder="Removing" currentlySelected={removingSubjects} onSelect={subjectSelectedToRemove} />
              </div>
              <div className="col-xs-9" style={{ display: "flex", flexWrap: "wrap" }}>
                <DisplaySelectedSubjects currentlySelected={removingSubjects} onRemove={dontRemoveSubject} />
              </div>

              <div className="col-xs-12">
                <Button onClick={resetSubjects} preset="default-xs">
                  Reset subjects
                </Button>
              </div>
            </FlexRow>
          </TabContent>
          <TabContent tabName="books">
            <Stack style={{ fontSize: "14px" }}>
              {modifyingBooks.map(book => (
                <div key={book._id}>{book.title}</div>
              ))}
            </Stack>
          </TabContent>
        </TabContents>
      </Tabs>
      <hr />
      <div className="standard-modal-footer">
        <FlowItems>
          <ActionButton style={{ minWidth: "10ch" }} preset="primary" text="Save" runningText="Saving" finishedText="Saved" onClick={save} />

          <Button style={{ minWidth: "10ch" }} preset="" onClick={props.onDone}>
            Cancel
          </Button>
        </FlowItems>
      </div>
    </Modal>
  );
};

export default BookSubjectSetter;
