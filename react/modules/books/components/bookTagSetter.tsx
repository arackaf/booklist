import React, { SFC, useState, useLayoutEffect, useRef, FunctionComponent } from "react";

import { Button, ActionButton } from "app/components/ui/Button";

import { useMutation } from "micro-graphql-react";
import updateBookSubjects from "graphql/books/updateBookTags.graphql";

import Modal from "app/components/ui/Modal";
import { MutationOf, Mutations } from "graphql/graphql-typings";
import FlexRow from "app/components/layout/FlexRow";
import FlowItems from "app/components/layout/FlowItems";
import { TabHeaders, Tabs, TabHeader, TabContents, TabContent } from "app/components/layout/Tabs";
import Stack from "app/components/layout/Stack";
import DisplaySelectedTags from "app/components/subjectsAndTags/tags/DisplaySelectedTags";
import SelectAvailableTags from "app/components/subjectsAndTags/tags/SelectAvailableTags";

const BookTagSetterDesktop: FunctionComponent<{ modifyingBooks: any[]; onDone: any }> = props => {
  const [addingTags, setAddingTags] = useState([]);
  const [removingTags, setRemovingTags] = useState([]);
  const resetTags = () => {
    setRemovingTags([]);
    setAddingTags([]);
  };

  useLayoutEffect(() => {
    if (props.modifyingBooks.length) {
      resetTags();
    }
  }, [props.modifyingBooks.length]);
  const { runMutation } = useMutation<MutationOf<Mutations["updateBooks"]>>(updateBookSubjects);

  const setBooksTags = () => {
    let args = { books: props.modifyingBooks.map(b => b._id), add: addingTags, remove: removingTags };
    return Promise.resolve(runMutation(args)).then(() => {
      props.onDone();
    });
  };
  const addingTagSet = (adding, { _id }) => setAddingTags(adding ? addingTags.concat(_id) : addingTags.filter(x => x != _id));
  const tagSelectedToAdd = addingTagSet.bind(null, true);

  const removingTagSet = (adding, { _id }) => setRemovingTags(adding ? removingTags.concat(_id) : removingTags.filter(x => x != _id));
  const tagSelectedToRemove = removingTagSet.bind(null, true);

  const dontAddTag = addingTagSet.bind(null, false);
  const dontRemoveTag = removingTagSet.bind(null, false);
  const modifyingBooks = props.modifyingBooks || [];
  const selectRef = useRef(null);

  return (
    <Modal className="fade" isOpen={!!modifyingBooks.length} onHide={props.onDone} headerCaption="Add / Remove Tags:" focusRef={selectRef}>
      <Tabs defaultTab="tags">
        <TabHeaders>
          <TabHeader tabName="tags" spacerText="Choose tags">
            <a ref={selectRef}>Choose tags</a>
          </TabHeader>
          <TabHeader tabName="books" text="For books" />
        </TabHeaders>
        <TabContents>
          <TabContent tabName="tags">
            <FlexRow>
              <div className="col-xs-3">
                <SelectAvailableTags currentlySelected={addingTags} onSelect={tagSelectedToAdd} placeholder="Adding" />
              </div>
              <div className="col-xs-9">
                <DisplaySelectedTags currentlySelected={addingTags} onRemove={dontAddTag} />
              </div>

              <div className="col-xs-3">
                <SelectAvailableTags currentlySelected={removingTags} onSelect={tagSelectedToRemove} placeholder="Removing" />
              </div>
              <div className="col-xs-9">
                <DisplaySelectedTags currentlySelected={removingTags} onRemove={dontRemoveTag} />
              </div>

              <Button onClick={resetTags} preset="default-xs">
                Reset tags
              </Button>
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
          <ActionButton preset="primary" style={{ minWidth: "10ch" }} text="Save" runningText="Saving" finishedText="Saved" onClick={setBooksTags} />

          <Button preset="" style={{ minWidth: "10ch" }} onClick={props.onDone}>
            Cancel
          </Button>
        </FlowItems>
      </div>
    </Modal>
  );
};

export default BookTagSetterDesktop;
