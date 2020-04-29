import React, { FunctionComponent, useState, useRef, useMemo, useContext, useReducer, useLayoutEffect } from "react";

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
import { SlideInContents, useHeight } from "app/animationHelpers";

import "./recommend.scss";
import { AppContext } from "app/renderUI";
import { useQuery, buildQuery } from "micro-graphql-react";
import { QueryOf, Queries } from "graphql-typings";

import BooksQuery from "graphQL/home/searchBooks.graphql";

interface LocalProps {
  isOpen: boolean;
  onHide: any;
  setBookSearchState: any;
  dispatch: any;
  selectedBooksSet: any;
}

const initialState = { active: false, page: 1, pageSize: 50, sort: { title: 1 }, tags: [], subjects: [] };
const searchStateReducer = (_oldState, payload) => (payload ? { active: true, page: 1, ...payload } : initialState);

const SearchModal: FunctionComponent<Partial<LocalProps>> = props => {
  const [{ publicUserId }] = useContext(AppContext);
  const [{ active, ...searchState }, searchDispatch] = useReducer(searchStateReducer, initialState);

  const variables = { ...searchState, publicUserId };

  const { loading, loaded, data, error, currentQuery } = useQuery<QueryOf<Queries["allBooks"]>>(buildQuery(BooksQuery, variables, { active }));
  const { isOpen, onHide, dispatch, selectedBooksSet } = props;

  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState([]);

  const noAvailableBooks = useMemo(() => {
    const allBooks = data?.allBooks?.Books;

    return allBooks?.length && !allBooks.find(b => !selectedBooksSet.has(b._id));
  }, [selectedBooksSet, data]);

  useLayoutEffect(() => {
    if (props.isOpen) {
      setSubjects(searchState.subjects || []);
      setTags(searchState.tags || []);
      searchDispatch(null);
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
    searchDispatch({
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

              <CSSTransition in={noAvailableBooks} key={2} classNames="bl-animate" timeout={300}>
                <div className="bl-fade alert alert-info alert-slimmer">You've added all of the books from these results</div>
              </CSSTransition>
            </FlexRow>
          </div>

          <div className="col-xs-12">
            <SearchResults {...{ dispatch, loaded, loading, data, error, currentQuery, selectedBooksSet, active }} />
          </div>
        </FlexRow>
      </Form>
    </Modal>
  );
};

export default SearchModal;

const SearchResults = props => {
  const books = props?.data?.allBooks?.Books;
  const { loading, selectedBooksSet, currentQuery, active } = props;
  const availableBooks = books?.filter(b => !selectedBooksSet.has(b._id));
  const currentBooksRef = useRef<any>();
  currentBooksRef.current = availableBooks;

  const [ref, _height] = useHeight();
  const height = _height == "auto" ? "audo" : (Math.min(_height, 300) as any);

  const [animating, setAnimating] = useState(false);

  return (
    <div
      className="animate-height animate-fast"
      style={{ height: animating ? "auto" : height, maxHeight: "300px", overflowY: "auto", marginTop: "5px", position: "relative" }}
    >
      <div className="overlay-holder" ref={ref}>
        <TransitionGroup component={null}>
          {books == null || !active ? null : books?.length ? (
            <CSSTransition classNames="bl-animate" timeout={300} key={currentQuery}>
              <ul className="animate-fast bl-fade bl-overlay-exit">
                <TransitionGroup component={null}>
                  {availableBooks.map(book => (
                    <SlideInContents
                      key={book._id}
                      component="li"
                      className="bl-no-animate-in animate-fast bl-fade-out bl-slide-out"
                      onExit={() => setAnimating(true)}
                      onExited={() => setAnimating(false)}
                    >
                      <SearchResult key={book._id} book={book} dispatch={props.dispatch} />
                    </SlideInContents>
                  ))}
                </TransitionGroup>
              </ul>
            </CSSTransition>
          ) : (
            <CSSTransition key={3} classNames="bl-animate" timeout={300}>
              <div style={{ alignSelf: "start" }} className="animate-fast bl-fade alert alert-warning">
                No results
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
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
    <Stack className={props.className}>
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
  );
};
