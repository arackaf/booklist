import React, { SFC, useState, useLayoutEffect, useContext, useRef } from "react";

import BootstrapButton, { AjaxButton } from "app/components/bootstrapButton";
import SelectAvailable from "app/components/availableTagsOrSubjects";

import { useMutation, buildMutation } from "micro-graphql-react";
import updateBookSubjects from "graphQL/books/updateBookTags.graphql";

import Modal from "app/components/modal";
import { filterTags, useTagsState } from "app/tagsState";
import { MutationOf, Mutations } from "graphql-typings";
import FlexRow from "app/components/layout/FlexRow";
import FlowItems from "app/components/layout/FlowItems";

const BookTagSetterDesktop: SFC<{ modifyingBooks: any[]; onDone: any }> = props => {
  const { tagHash, tags } = useTagsState();
  const [currentTab, setTab] = useState("tags");
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
      onHide={() => {
        props.onDone();
        setTab("tags");
      }}
      headerCaption="Add / Remove Tags:"
      focusRef={selectRef}
    >
      <div className="tab-headers">
        <div className={"tab-header " + (currentTab == "tags" ? "active" : "")}>
          <a ref={selectRef} onClick={() => setTab("tags")}>
            Choose tags
          </a>
        </div>
        <div className={"tab-header " + (currentTab == "books" ? "active" : "")}>
          <a onClick={() => setTab("books")}>For books</a>
        </div>
      </div>
      <div className="tab-content">
        <div style={{ minHeight: "100px" }} className={"margin-top tab-pane " + (currentTab == "tags" ? "active" : "")}>
          <FlexRow>
            <div className="col-xs-3">
              <SelectAvailable placeholder="Adding" items={tags} currentlySelected={addingTags} onSelect={tagSelectedToAdd} filter={filterTags} />
            </div>
            <div className="col-xs-9" style={{ display: "flex", flexWrap: "wrap", marginBottom: "-5px" }}>
              {addingTags
                .map(_id => tagHash[_id])
                .map((s: any, i) => (
                  <span
                    key={i}
                    style={{ color: s.textColor || "white", backgroundColor: s.backgroundColor, marginTop: "5px" }}
                    className="label label-default margin-left"
                  >
                    <a onClick={() => dontAddTag(s)} style={{ color: s.textColor || "white", paddingRight: "5px", marginRight: "5px" }}>
                      X
                    </a>
                    {s.name}
                  </span>
                ))}
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
            <div className="col-xs-9" style={{ display: "flex", flexWrap: "wrap", marginBottom: "-5px" }}>
              {removingTags
                .map(_id => tagHash[_id])
                .map((s: any, i) => (
                  <span
                    key={i}
                    style={{ color: s.textColor || "white", backgroundColor: s.backgroundColor, marginTop: "5px" }}
                    className="label label-default margin-left"
                  >
                    <a onClick={() => dontRemoveTag(s)} style={{ color: s.textColor || "white", paddingRight: "5px", marginRight: "5px" }}>
                      X
                    </a>
                    {s.name}
                  </span>
                ))}
            </div>

            <BootstrapButton onClick={resetTags} preset="default-xs">
              Reset tags
            </BootstrapButton>
          </FlexRow>
        </div>
        <div style={{ minHeight: "100px" }} className={"tab-pane " + (currentTab == "books" ? "active" : "")}>
          <ul style={{ fontSize: "14px" }}>
            {modifyingBooks.map(book => (
              <li key={book._id}>{book.title}</li>
            ))}
          </ul>
        </div>
      </div>
      <hr />
      <div className="standard-modal-footer">
        <FlowItems>
          <AjaxButton preset="primary" runningText="Setting" finishedText="Saved" onClick={setBooksTags}>
            Set
          </AjaxButton>
          <BootstrapButton preset="" onClick={props.onDone}>
            Cancel
          </BootstrapButton>
        </FlowItems>
      </div>
    </Modal>
  );
};

export default BookTagSetterDesktop;
