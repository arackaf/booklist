import React, { FunctionComponent, useState, useContext, useEffect, useRef } from "react";

import Modal from "app/components/modal";
import SelectAvailableTags from "app/components/selectAvailableTags";
import DisplaySelectedTags from "app/components/displaySelectedTags";
import SelectAvailableSubjects from "app/components/selectAvailableSubjects";
import DisplaySelectedSubjects from "app/components/displaySelectedSubjects";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import { SearchContext, ISearchBookRaw } from "modules/home/searchState";

interface LocalProps {
  isOpen: boolean;
  onHide: any;
  setBookSearchState: any;
  searchState: any;
  searchResults: any;
  dispatch: any;
  selectedBooksSet: any;
}

const SearchModal: FunctionComponent<Partial<LocalProps>> = props => {
  const { isOpen, onHide, setBookSearchState, searchState, searchResults, dispatch, selectedBooksSet } = props;

  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState([]);
  const { loading, loaded, data, error } = searchResults;

  useEffect(() => {
    if (props.isOpen) {
      setSubjects(searchState.subjects || []);
      setTags(searchState.tags || []);
    }
  }, [props.isOpen]);

  const selectSubject = subject => setSubjects(subjects.concat(subject._id));
  const selectTag = tag => setTags(tags.concat(tag._id));
  const removeSubject = subject => setSubjects(subjects.filter(_id => _id != subject._id));
  const removeTag = tag => setTags(tags.filter(_id => _id != tag._id));

  const searchEl = useRef(null);
  const childSubEl = useRef(null);
  const isReadE = useRef(null);
  const isRead0 = useRef(null);
  const isRead1 = useRef(null);

  const applyFilters = evt => {
    evt.preventDefault();
    setBookSearchState({
      title: searchEl.current.value || "",
      isRead: isReadE.current.checked ? void 0 : isRead0.current.checked ? false : true,
      subjects: subjects.length ? subjects : null,
      tags: tags.length ? tags : null,
      searchChildSubjects: childSubEl.current.checked
    });
  };
  return (
    <Modal {...{ isOpen, onHide, headerCaption: "Search your books" }}>
      <form onSubmit={applyFilters}>
        <div className="row">
          <div className="col-xs-6">
            <div className="form-group">
              <label>Title</label>
              <input defaultValue={searchState.title} ref={searchEl} placeholder="Search title" className="form-control" />
            </div>
          </div>

          <div className="col-xs-6">
            <label className="form-label">Is read?</label>
            <div className="radio responsive-radios">
              <span>
                <input type="radio" defaultChecked={searchState.isRead == null} ref={isReadE} name="isRead" id="isReadE" />
                <label htmlFor="isReadE">Either</label>
              </span>
              <span>
                <input type="radio" defaultChecked={searchState.isRead == "1"} ref={isRead1} name="isRead" id="isReadY" />
                <label htmlFor="isReadY">Yes</label>
              </span>
              <span>
                <input type="radio" defaultChecked={searchState.isRead == "0"} ref={isRead0} name="isRead" id="isReadN" />
                <label htmlFor="isReadN">No</label>
              </span>
            </div>
          </div>
        </div>
      </form>
      <div className="row" style={{ position: "relative" }}>
        <div className="col-xs-3">
          <SelectAvailableTags currentlySelected={tags} onSelect={selectTag} />
        </div>
        <div className="col-xs-9">
          <div>
            <DisplaySelectedTags currentlySelected={tags} onRemove={removeTag} />
          </div>
        </div>
      </div>
      <br />
      <>
        <div className="row" style={{ position: "relative" }}>
          <div className="col-xs-3">
            <SelectAvailableSubjects currentlySelected={subjects} onSelect={selectSubject} />
          </div>
          <div className="col-xs-9">
            <div>
              <DisplaySelectedSubjects currentlySelected={subjects} onRemove={removeSubject} />
            </div>
          </div>
        </div>
        <br />
        <div className="row" style={{ position: "relative" }}>
          <div className="col-xs-6">
            <div className="checkbox">
              <label>
                <input type="checkbox" ref={childSubEl} defaultChecked={!!searchState.searchChildSubjects} /> Also search child subjects
              </label>
            </div>
          </div>
          <div className="col-xs-12 margin-top">
            {loading ? (
              <button disabled={true} className="btn btn-default">
                <i className="fa fa-fw fa-spin fa-spinner" />
              </button>
            ) : (
              <button onClick={applyFilters} className="btn btn-default">
                <i className="fal fa-search" />
              </button>
            )}
          </div>
        </div>
      </>
      {loaded ? <SearchResults {...{ dispatch, loaded, loading, data, error, selectedBooksSet }} /> : null}
    </Modal>
  );
};

export default SearchModal;

const SearchResults = props => {
  const books = props.data.allBooks.Books;
  const { loading, selectedBooksSet } = props;

  return (
    <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "5px" }}>
      {books.length ? (
        <table className="table table-condensed table-striped">
          <thead>
            <tr>
              <th />
              <th />
              <th />
            </tr>
          </thead>
          <TransitionGroup component="tbody">
            {books
              .filter(b => !selectedBooksSet.has(b._id))
              .map(book => (
                <CSSTransition appear={false} enter={false} exit={!loading} classNames="fade-transition" timeout={300} key={book._id}>
                  <SearchResult key={book._id} book={book} dispatch={props.dispatch} />
                </CSSTransition>
              ))}
          </TransitionGroup>
        </table>
      ) : (
        <div className="alert alert-warning">No results</div>
      )}
    </div>
  );
};

const SearchResult = props => {
  const [adding, setAdding] = useState(false);

  const selectBook = () => {
    setAdding(true);
    props.dispatch(["selectBook", props.book]);
  };

  let { book } = props;
  return (
    <tr>
      <td>
        <button disabled={adding} onClick={selectBook} style={{ cursor: "pointer", whiteSpace: "nowrap" }} className="btn btn-primary btn-xs">
          Add to list&nbsp;
          <i className="fal fa-plus" />
        </button>
      </td>
      <td>
        <img src={book.smallImage} />
      </td>
      <td>
        {book.title}
        {book.authors && book.authors.length ? (
          <>
            <br />
            <span style={{ fontStyle: "italic" }}>{book.authors.join(", ")}</span>
          </>
        ) : null}
      </td>
    </tr>
  );
};
