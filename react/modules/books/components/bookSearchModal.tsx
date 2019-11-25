import React, { FunctionComponent, useState, useLayoutEffect, useRef } from "react";

import BootstrapButton from "app/components/bootstrapButton";

import Modal from "app/components/modal";
import SelectAvailableTags from "app/components/selectAvailableTags";
import DisplaySelectedTags from "app/components/displaySelectedTags";
import SelectAvailableSubjects from "app/components/selectAvailableSubjects";
import DisplaySelectedSubjects from "app/components/displaySelectedSubjects";
import { useCurrentSearch } from "../booksSearchState";
import { applyFilters } from "../setBookFilters";

type LocalProps = {
  isOpen: boolean;
  onHide: any;
};

const BookSearchModal: FunctionComponent<LocalProps> = props => {
  const filters = useCurrentSearch();

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
  const [noSubjectsFilter, setNoSubjectsFilter] = useState(!!filters.noSubjects);

  const selectSubject = subject => setSubjects(subjects.concat(subject._id));
  const selectTag = tag => setTags(tags.concat(tag._id));
  const removeSubject = subject => setSubjects(subjects.filter(_id => _id != subject._id));
  const removeTag = tag => setTags(tags.filter(_id => _id != tag._id));

  useLayoutEffect(() => {
    if (props.isOpen) {
      setSubjects(filters.subjectIds);
      setTags(filters.tagIds);
    }
  }, [props.isOpen]);

  const updateFilters = evt => {
    let sort = "";
    let sortDirection = "";
    let sortValue = sortSelectEl.current.value;
    if (sortValue !== "_id|desc") {
      [sort, sortDirection] = sortValue.split("|");
    }

    evt.preventDefault();
    applyFilters({
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
      <form onSubmit={updateFilters}>
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <div className="form-group">
              <label>Title</label>
              <input defaultValue={filters.search} ref={searchEl} placeholder="Search title" className="form-control" />
            </div>
          </div>
          <div className="col-sm-6 col-xs-12">
            <div className="form-group">
              <label>Pages</label>
              <div className="form-inline">
                <div style={{ marginRight: 5, display: "inline-block" }} className="form-group">
                  <select ref={pagesDirEl} defaultValue={filters.pagesOperator} className="form-control">
                    <option value="lt">{"<"}</option>
                    <option value="gt">{">"}</option>
                  </select>
                </div>
                <div className="form-group" style={{ display: "inline-block" }}>
                  <input
                    defaultValue={filters.pages}
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
              <input ref={publisherEl} defaultValue={filters.publisher} placeholder="Publisher" className="form-control" />
            </div>
          </div>
          <div className="col-xs-6">
            <div className="form-group">
              <label>Author</label>
              <input ref={authorEl} defaultValue={filters.author} placeholder="Author" className="form-control" />
            </div>
          </div>
          <div className="col-xs-6">
            <div>
              <label className="form-label">Is read?</label>
              <div className="radio responsive-radios">
                <span>
                  <input type="radio" defaultChecked={filters.isRead == ""} ref={isReadE} name="isRead" id="isReadE" />
                  <label htmlFor="isReadE">Either</label>
                </span>
                <span>
                  <input type="radio" defaultChecked={filters.isRead == "1"} name="isRead" id="isReadY" />
                  <label htmlFor="isReadY">Yes</label>
                </span>
                <span>
                  <input type="radio" defaultChecked={filters.isRead == "0"} ref={isRead0} name="isRead" id="isReadN" />
                  <label htmlFor="isReadN">No</label>
                </span>
              </div>
            </div>
          </div>
          <div className="col-xs-6">
            <div className="form-group">
              <label>Sort</label>
              <select ref={sortSelectEl} style={{ marginBottom: 0 }} defaultValue={filters.bindableSortValue} className="form-control margin-bottom">
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
        <div className="col-sm-9 col-xs-12" style={{ display: "flex", flexWrap: "wrap", marginBottom: "-5px" }}>
          <DisplaySelectedTags currentlySelected={tags} onRemove={removeTag} />
        </div>
      </div>
      <br />
      {!noSubjectsFilter ? (
        <>
          <div className="row" style={{ position: "relative" }}>
            <div className="col-sm-3 col-xs-12">
              <SelectAvailableSubjects currentlySelected={subjects} onSelect={selectSubject} />
            </div>
            <div className="col-sm-9 col-xs-12" style={{ display: "flex", flexWrap: "wrap", marginBottom: "-5px" }}>
              <DisplaySelectedSubjects currentlySelected={subjects} onRemove={removeSubject} />
            </div>
          </div>
          <div className="checkbox" style={{ marginTop: "20px" }}>
            <label>
              <input type="checkbox" ref={childSubEl} defaultChecked={!!filters.searchChildSubjects} /> Also search child subjects
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
      <div className="standard-modal-footer">
        <BootstrapButton preset="primary" className="pull-left" onClick={updateFilters}>
          Filter
        </BootstrapButton>
        <BootstrapButton preset="default" onClick={onHide}>
          Close
        </BootstrapButton>
      </div>
    </Modal>
  );
};

export default BookSearchModal;
