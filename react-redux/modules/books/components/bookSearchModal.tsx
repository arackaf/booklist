import React, { FunctionComponent, Component, useState, useLayoutEffect, useRef } from "react";
import { connect } from "react-redux";
import { selectBookSearchState } from "modules/books/reducers/bookSearch/reducer";

import BootstrapButton from "applicationRoot/components/bootstrapButton";

import * as bookSearchActionCreators from "../reducers/bookSearch/actionCreators";

import Modal from "applicationRoot/components/modal";
import SelectAvailableTags from "applicationRoot/components/selectAvailableTags";
import DisplaySelectedTags from "applicationRoot/components/displaySelectedTags";
import SelectAvailableSubjects from "applicationRoot/components/selectAvailableSubjects";
import DisplaySelectedSubjects from "applicationRoot/components/displaySelectedSubjects";

type LocalProps = {
  isOpen: boolean;
  onHide: any;
};

const BookSearchModal: FunctionComponent<ReturnType<typeof selectBookSearchState> & LocalProps & typeof bookSearchActionCreators> = props => {
  const searchEl = useRef(null);
  const pagesEl = useRef(null);
  const pagesDirEl = useRef(null);
  const isReadE = useRef(null);
  const isRead0 = useRef(null);
  const childSubEl = useRef(null);
  const authorEl = useRef(null);
  const publisherEl = useRef(null);
  const sortSelectEl = useRef(null);

  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [noSubjectsFilter, setNoSubjectsFilter] = useState(!!props.noSubjects);

  const selectSubject = subject => setSubjects(subjects.concat(subject._id));
  const selectTag = tag => setTags(tags.concat(tag._id));
  const removeSubject = subject => setSubjects(subjects.filter(_id => _id != subject._id));
  const removeTag = tag => setTags(tags.filter(_id => _id != tag._id));

  useLayoutEffect(() => {
    if (props.isOpen) {
      setSubjects(props.selectedSubjects.map(s => s._id));
      setTags(props.selectedTags.map(t => t._id));
    }
  }, [props.isOpen]);

  const applyFilters = evt => {
    let sort = "";
    let sortDirection = "";
    let sortValue = sortSelectEl.current.value;
    if (sortValue !== "_id|desc") {
      [sort, sortDirection] = sortValue.split("|");
    }

    evt.preventDefault();
    props.applyFilters({
      subjects: noSubjectsFilter ? [] : subjects,
      tags,
      search: searchEl.current.value,
      pages: pagesEl.current.value,
      pagesOperator: pagesDirEl.current.value,
      author: authorEl.current.value,
      publisher: publisherEl.current.value,
      isRead: isReadE.current.checked ? "" : isRead0.current.checked ? "0" : "1",
      searchChildSubjects: childSubEl.current && childSubEl.current.checked,
      noSubjects: noSubjectsFilter,
      sort,
      sortDirection
    });
    props.onHide();
  };

  let { isOpen, onHide } = props;

  return (
    <Modal {...{ isOpen, onHide, headerCaption: "Full search" }}>
      <form onSubmit={applyFilters}>
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <div className="form-group">
              <label>Title</label>
              <input defaultValue={props.search} ref={searchEl} placeholder="Search title" className="form-control" />
            </div>
          </div>
          <div className="col-sm-6 col-xs-12">
            <div className="form-group">
              <label>Pages</label>
              <div className="form-inline">
                <div style={{ marginRight: 5, display: "inline-block" }} className="form-group">
                  <select ref={pagesDirEl} defaultValue={props.pagesOperator} className="form-control">
                    <option value="lt">{"<"}</option>
                    <option value="gt">{">"}</option>
                  </select>
                </div>
                <div className="form-group" style={{ display: "inline-block" }}>
                  <input
                    defaultValue={props.pages}
                    ref={pagesEl}
                    style={{ width: "100px" }}
                    type="number"
                    placeholder="Pages"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-6">
            <div className="form-group">
              <label>Publisher</label>
              <input ref={publisherEl} defaultValue={props.publisher} placeholder="Publisher" className="form-control" />
            </div>
          </div>
          <div className="col-xs-6">
            <div className="form-group">
              <label>Author</label>
              <input ref={authorEl} defaultValue={props.author} placeholder="Author" className="form-control" />
            </div>
          </div>
          <div className="col-xs-6">
            <div className="form-group">
              <label>Is read?</label>
              <br />
              <div className="radio responsive-radios">
                <label>
                  <input type="radio" defaultChecked={props.isRead == ""} ref={isReadE} name="isRead" />
                  Either
                </label>
              </div>
              <div className="radio responsive-radios">
                <label>
                  <input type="radio" defaultChecked={props.isRead == "1"} name="isRead" />
                  Yes
                </label>
              </div>
              <div className="radio responsive-radios">
                <label>
                  <input type="radio" defaultChecked={props.isRead == "0"} ref={isRead0} name="isRead" />
                  No
                </label>
              </div>
            </div>
          </div>
          <div className="col-xs-6">
            <div className="form-group">
              <label>Sort</label>
              <br />
              <select ref={sortSelectEl} style={{ marginBottom: 0 }} defaultValue={props.bindableSortValue} className="form-control margin-bottom">
                <option value="title|asc">Title A-Z</option>
                <option value="title|desc">Title Z-A</option>
                <option value="pages|asc">Pages, Low</option>
                <option value="pages|desc">Pages, High</option>
                <option value="_id|asc">Created, Earliest</option>
                <option value="_id|desc">Created, Latest</option>
              </select>
            </div>
          </div>
        </div>
        <button style={{ display: "none" }} />
        <input type="submit" style={{ display: "inline", visibility: "hidden" }} />
      </form>
      <div className="row" style={{ position: "relative" }}>
        <div className="col-sm-3 col-xs-12">
          <SelectAvailableTags currentlySelected={tags} onSelect={selectTag} />
        </div>
        <div className="col-sm-9 col-xs-12">
          <div>
            <DisplaySelectedTags currentlySelected={tags} onRemove={removeTag} />
          </div>
        </div>
      </div>
      <br />
      {!noSubjectsFilter ? (
        <>
          <div className="row" style={{ position: "relative" }}>
            <div className="col-sm-3 col-xs-12">
              <SelectAvailableSubjects currentlySelected={subjects} onSelect={selectSubject} />
            </div>
            <div className="col-sm-9 col-xs-12">
              <div>
                <DisplaySelectedSubjects currentlySelected={subjects} onRemove={removeSubject} />
              </div>
            </div>
          </div>
          <div className="checkbox">
            <label>
              <input type="checkbox" ref={childSubEl} defaultChecked={!!props.searchChildSubjects} /> Also search child subjects
            </label>
          </div>
        </>
      ) : null}
      <div className="checkbox" style={{ marginTop: "5px" }}>
        <label>
          <input type="checkbox" checked={!!noSubjectsFilter} onChange={el => setNoSubjectsFilter(!!el.target.checked)} /> Search books with no
          subjects set
        </label>
      </div>
      <hr />
      <BootstrapButton preset="primary" className="pull-left" onClick={applyFilters}>
        Filter
      </BootstrapButton>
      &nbsp;
      <BootstrapButton preset="default" onClick={onHide}>
        Close
      </BootstrapButton>
    </Modal>
  );
};

export default connect(
  selectBookSearchState,
  { ...bookSearchActionCreators }
)(BookSearchModal);
