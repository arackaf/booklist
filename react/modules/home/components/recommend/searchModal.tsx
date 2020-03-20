import React, { FunctionComponent, useState, useEffect, useRef } from "react";

import Modal from "app/components/modal";
import SelectAvailableTags from "app/components/selectAvailableTags";
import DisplaySelectedTags from "app/components/displaySelectedTags";
import SelectAvailableSubjects from "app/components/selectAvailableSubjects";
import DisplaySelectedSubjects from "app/components/displaySelectedSubjects";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import FlexRow from "app/components/layout/FlexRow";
import Stack from "app/components/layout/Stack";
import FlowItems from "app/components/layout/FlowItems";

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
  const { loading, loaded, data, error, currentQuery } = searchResults;

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
        <FlexRow>
          <div className="col-xs-6">
            <div className="form-group">
              <label>Title</label>
              <input defaultValue={searchState.title} ref={searchEl} placeholder="Search title" className="form-control" />
            </div>
          </div>

          <div className="col-xs-6">
            <Stack>
              <label className="form-label">Is read?</label>
              <FlowItems className="radio">
                <FlowItems tightest={true} vCenter={true}>
                  <input type="radio" defaultChecked={searchState.isRead == null} ref={isReadE} name="isRead" id="isReadE" />
                  <label htmlFor="isReadE">Either</label>
                </FlowItems>
                <FlowItems tightest={true} vCenter={true}>
                  <input type="radio" defaultChecked={searchState.isRead == "1"} ref={isRead1} name="isRead" id="isReadY" />
                  <label htmlFor="isReadY">Yes</label>
                </FlowItems>
                <FlowItems tightest={true} vCenter={true}>
                  <input type="radio" defaultChecked={searchState.isRead == "0"} ref={isRead0} name="isRead" id="isReadN" />
                  <label htmlFor="isReadN">No</label>
                </FlowItems>
              </FlowItems>
            </Stack>
          </div>

          <div className="col-xs-3">
            <SelectAvailableTags currentlySelected={tags} onSelect={selectTag} />
          </div>
          <div className="col-xs-9">
            <DisplaySelectedTags currentlySelected={tags} onRemove={removeTag} />
          </div>

          <div className="col-xs-3">
            <SelectAvailableSubjects currentlySelected={subjects} onSelect={selectSubject} />
          </div>
          <div className="col-xs-9">
            <DisplaySelectedSubjects currentlySelected={subjects} onRemove={removeSubject} />
          </div>

          <div className="col-xs-6">
            <div className="checkbox">
              <label>
                <input type="checkbox" ref={childSubEl} defaultChecked={!!searchState.searchChildSubjects} /> Also search child subjects
              </label>
            </div>
          </div>

          <div className="col-xs-12">
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

          <div className="col-xs-12">
            <SearchResults {...{ dispatch, loaded, loading, data, error, currentQuery, selectedBooksSet }} />
          </div>
        </FlexRow>
      </form>
    </Modal>
  );
};

export default SearchModal;

const SearchResults = props => {
  const books = props?.data?.allBooks?.Books;
  const { loading, selectedBooksSet, currentQuery } = props;
  const availableBooks = books?.filter(b => !selectedBooksSet.has(b._id));

  return (
    <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "5px", position: "relative" }}>
      <TransitionGroup component={null}>
        {availableBooks == null ? null : availableBooks?.length ? (
          <CSSTransition
            key={currentQuery}
            appear={true}
            enter={true}
            exit={true}
            classNames="animate-fast bl-overlay bl-fade bl-animate"
            timeout={3500}
          >
            <ul className="overlay animate-fast">
              <TransitionGroup component={null}>
                {availableBooks
                  .map(book => (
                    <CSSTransition
                      appear={false}
                      enter={false}
                      exit={!loading}
                      classNames="animate-fast-s bl-fade bl-slide-out bl-animate"
                      timeout={300}
                      key={book._id}
                    >
                      <SearchResult key={book._id} book={book} dispatch={props.dispatch} />
                    </CSSTransition>
                  ))}
              </TransitionGroup>
            </ul>
          </CSSTransition>
        ) : books?.length ? (
          <CSSTransition key={2} classNames="animate-fast bl-overlay bl-fade bl-animate" timeout={300}>
            <div className="alert alert-info">You've added all of the books from these results</div>
          </CSSTransition>
        ) : (
          <CSSTransition key={3} classNames="animate-fast bl-overlay bl-fade bl-animate" timeout={300}>
            <div className="alert alert-warning">No results</div>
          </CSSTransition>
        )}
      </TransitionGroup>
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
    <li>
      <Stack>
        <FlowItems>
          <div style={{ minWidth: "70px" }}>
            <img src={book.smallImage} />
          </div>

          <Stack style={{ flex: 1 }}>
            {book.title}
            {book.authors && book.authors.length ? <span style={{ fontStyle: "italic", fontSize: "14px" }}>{book.authors.join(", ")}</span> : null}
            <button
              disabled={adding}
              onClick={selectBook}
              style={{ cursor: "pointer", marginTop: "auto", alignSelf: "flex-start" }}
              className="btn btn-primary btn-xs"
            >
              Add to list&nbsp;
              <i className="fal fa-plus" />
            </button>
          </Stack>
        </FlowItems>
        <hr />
      </Stack>
    </li>
  );
};
