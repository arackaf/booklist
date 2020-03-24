import React, { SFC, useState, useLayoutEffect, useContext, useRef } from "react";

import { Button, AjaxButton } from "app/components/ui/Button";
import SelectAvailable from "app/components/subjectsAndTags/AvailableTagsOrSubjects";

import { useMutation, buildMutation } from "micro-graphql-react";
import updateBookSubjects from "graphQL/books/updateBookTags.graphql";

import Modal from "app/components/ui/modal";
import { filterTags, useTagsState } from "app/state/tagsState";
import { MutationOf, Mutations } from "graphql-typings";
import FlexRow from "app/components/layout/FlexRow";
import FlowItems from "app/components/layout/FlowItems";
import { TabHeaders, Tabs, TabHeader, TabContents, TabContent } from "app/components/layout/Tabs";
import Stack from "app/components/layout/Stack";
import DisplaySelectedTags from "app/components/subjectsAndTags/tags/DisplaySelectedTags";

const BookTagSetterDesktop: SFC<{ modifyingBooks: any[]; onDone: any }> = props => {
  const { tags } = useTagsState();
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
  const { runMutation } = useMutation<MutationOf<Mutations["updateBooks"]>>(buildMutation(updateBookSubjects));

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
    <Modal
      className="fade"
      isOpen={!!modifyingBooks.length}
      onHide={props.onDone}
      headerCaption="Add / Remove Tags:"
      focusRef={selectRef}
    >
      <Tabs defaultTab="tags">
        <TabHeaders>
          <TabHeader tabName="tags">
            <a ref={selectRef}>Choose tags</a>
          </TabHeader>
          <TabHeader tabName="books">
            <a>For books</a>
          </TabHeader>
        </TabHeaders>
        <TabContents>
          <TabContent tabName="tags">
            <FlexRow>
              <div className="col-xs-3">
                <SelectAvailable placeholder="Adding" items={tags} currentlySelected={addingTags} onSelect={tagSelectedToAdd} filter={filterTags} />
              </div>
              <div className="col-xs-9">
                <DisplaySelectedTags currentlySelected={addingTags} onRemove={dontAddTag} />
              </div>

              <div className="col-xs-3">
                <SelectAvailable
                  placeholder="Removing"
                  items={tags}
                  currentlySelected={removingTags}
                  onSelect={tagSelectedToRemove}
                  filter={filterTags}
                />
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
          <AjaxButton preset="primary" runningText="Setting" finishedText="Saved" onClick={setBooksTags}>
            Set
          </AjaxButton>
          <Button preset="" onClick={props.onDone}>
            Cancel
          </Button>
        </FlowItems>
      </div>
    </Modal>
  );
};

export default BookTagSetterDesktop;
