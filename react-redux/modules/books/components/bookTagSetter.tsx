import React, { SFC, useState, useLayoutEffect, useContext, useRef } from "react";

import BootstrapButton, { AjaxButton } from "applicationRoot/components/bootstrapButton";
import SelectAvailable from "applicationRoot/components/availableTagsOrSubjects";

import { useMutation, buildMutation } from "micro-graphql-react";
import updateBookSubjects from "graphQL/books/updateBookTags.graphql";

import Modal from "applicationRoot/components/modal";
import { filterTags, TagsContext } from "applicationRoot/tagsState";

const BookTagSetterDesktop: SFC<{ modifyingBooks: any[]; onDone: any }> = props => {
  const { tagHash, tags } = useContext(TagsContext);
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
  const { runMutation, running } = useMutation(buildMutation(updateBookSubjects));

  const setBooksTags = () => {
    let args = { books: props.modifyingBooks.map(b => b._id), add: addingTags, remove: removingTags };
    Promise.resolve(runMutation(args)).then(() => {
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
        <div style={{ minHeight: "150px" }} className={"tab-pane " + (currentTab == "tags" ? "active" : "")}>
          <br />
          <div style={{ position: "relative" }} className="row">
            <div className="col-xs-3">
              <SelectAvailable placeholder="Adding" items={tags} currentlySelected={addingTags} onSelect={tagSelectedToAdd} filter={filterTags} />
            </div>
            <div className="col-xs-9">
              <div>
                {addingTags
                  .map(_id => tagHash[_id])
                  .map((s: any, i) => (
                    <span
                      key={i}
                      style={{ color: s.textColor || "white", backgroundColor: s.backgroundColor, display: "inline-table" }}
                      className="label label-default margin-left"
                    >
                      <a onClick={() => dontAddTag(s)} style={{ color: s.textColor || "white", paddingRight: "5px", marginRight: "5px" }}>
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
                items={tags}
                currentlySelected={removingTags}
                onSelect={tagSelectedToRemove}
                filter={filterTags}
              />
            </div>
            <div className="col-xs-9">
              <div>
                {removingTags
                  .map(_id => tagHash[_id])
                  .map((s: any, i) => (
                    <span
                      key={i}
                      style={{ color: s.textColor || "white", backgroundColor: s.backgroundColor, display: "inline-table" }}
                      className="label label-default margin-left"
                    >
                      <a onClick={() => dontRemoveTag(s)} style={{ color: s.textColor || "white", paddingRight: "5px", marginRight: "5px" }}>
                        X
                      </a>
                      {s.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <br />
          <BootstrapButton onClick={resetTags} className="pull-right" preset="default-xs">
            Reset tags
          </BootstrapButton>
          <br />
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
      <AjaxButton preset="primary" running={running} runningText="Setting" onClick={setBooksTags}>
        Set
      </AjaxButton>
      &nbsp;
      <BootstrapButton preset="" onClick={props.onDone}>
        Cancel
      </BootstrapButton>
    </Modal>
  );
};

export default BookTagSetterDesktop;
