import React, { FunctionComponent, useState, useEffect, useRef, useMemo } from "react";

import Modal from "app/components/ui/Modal";
import SelectAvailableTags from "app/components/subjectsAndTags/tags/SelectAvailableTags";
import DisplaySelectedTags from "app/components/subjectsAndTags/tags/DisplaySelectedTags";
import SelectAvailableSubjects from "app/components/subjectsAndTags/subjects/SelectAvailableSubjects";
import DisplaySelectedSubjects from "app/components/subjectsAndTags/subjects/DisplaySelectedSubjects";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import FlexRow from "app/components/layout/FlexRow";
import Stack from "app/components/layout/Stack";
import FlowItems from "app/components/layout/FlowItems";
import { CoverSmall } from "app/components/bookCoverComponent";
import { Form, SubmitButton, SubmitIconButton } from "app/components/ui/Form";

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

  const noAvailableBooks = useMemo(() => {
    const allBooks = data?.allBooks?.Books;

    return allBooks?.length && !allBooks.find(b => !selectedBooksSet.has(b._id));
  }, [selectedBooksSet, searchResults.data]);

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

  const applyFilters = () => {
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
      <Form submit={applyFilters}>
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
            <FlexRow>
              {loading ? (
                <button style={{ minWidth: "5ch" }} disabled={true} className="btn btn-default">
                  <i className="fa fa-fw fa-spin fa-spinner" />
                </button>
              ) : (
                <SubmitIconButton key={1} className="btn btn-default">
                  <i className="fal fa-search" />
                </SubmitIconButton>
              )}

              <TransitionGroup component={null}>
                {noAvailableBooks ? (
                  <CSSTransition key={2} classNames="bl-animate" timeout={300}>
                    <div className="bl-fade alert alert-info alert-slimmer">You've added all of the books from these results</div>
                  </CSSTransition>
                ) : null}
              </TransitionGroup>
            </FlexRow>
          </div>

          <div className="col-xs-12">
            <SearchResults {...{ dispatch, loaded, loading, data, error, currentQuery, selectedBooksSet }} />
          </div>
        </FlexRow>
      </Form>
    </Modal>
  );
};

export default SearchModal;

const SearchResults = props => {
  const books = props?.data?.allBooks?.Books;
  const { loading, selectedBooksSet, currentQuery } = props;
  const availableBooks = books?.filter(b => !selectedBooksSet.has(b._id));
  const currentBooksRef = useRef<any>();
  currentBooksRef.current = availableBooks;

  return (
    <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "5px", position: "relative" }}>
      <TransitionGroup component={null}>
        {books == null ? null : books?.length ? (
          <CSSTransition key={currentQuery} classNames="bl-animate" timeout={300}>
            <ul className="animate-fast bl-overlay-exit bl-fade">
              <TransitionGroup component={null}>
                {availableBooks.map(book => (
                  <CSSTransition classNames="bl-animate" timeout={300} key={book._id}>
                    <SearchResult key={book._id} book={book} dispatch={props.dispatch} />
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </ul>
          </CSSTransition>
        ) : (
          <CSSTransition key={3} classNames="bl-animate" timeout={300}>
            <div className="animate-fast bl-overlay-exit bl-fade alert alert-warning">No results</div>
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
    <li className="animate-fast-s bl-fade bl-slide-out">
      <Stack>
        <FlowItems>
          <div style={{ minWidth: "70px" }}>
            <CoverSmall url={book.smallImage} />
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
