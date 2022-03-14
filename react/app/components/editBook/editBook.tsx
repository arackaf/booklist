import React, { useState, FunctionComponent, useLayoutEffect } from "react";
import type { IBookRaw } from "modules/books/booksState";

import EditBookInfo from "./editBookInfo";

import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "../layout/Tabs";
import ajaxUtil from "util/ajaxUtil";
import { needBookCoverPriming } from "util/localStorage";

import { EditBookCovers } from "./editBookCovers";

type Props = {
  saveBook: any;
  title: string;
  book: IBookRaw;
  onCancel: any;
};

const EditBook: FunctionComponent<Props> = ({ book: bookToEdit, onCancel, saveBook, title }) => {
  const [state, setState] = useState({ tab: "basic", bookEditing: null, title: "" });

  const updateBook = updateFn => {
    setState(state => ({ ...state, bookEditing: updateFn(state.bookEditing) }));
  };

  const editBook = book => {
    setState({
      tab: "basic",
      title,
      bookEditing: { ...book }
    });
  };

  useLayoutEffect(() => {
    if (bookToEdit && needBookCoverPriming()) {
      ajaxUtil.postWithCors(process.env.UPLOAD_BOOK_COVER, { avoidColdStart: true });
      ajaxUtil.postWithCors(process.env.UPLOAD_BOOK_COVER_FROM_URL, { avoidColdStart: true });
    }
    editBook(bookToEdit);
  }, [bookToEdit]);

  let { bookEditing } = state;
  let book = bookEditing;

  return (
    <Tabs defaultTab="basic">
      <TabHeaders>
        <TabHeader text="Book info" tabName="basic" />
        <TabHeader text="Covers" tabName="covers" />
      </TabHeaders>
      <TabContents>
        <TabContent tabName="basic">{book ? <EditBookInfo {...{ book, onCancel, saveBook }} updateBook={updateBook} /> : null}</TabContent>
        <TabContent tabName="covers">{book ? <EditBookCovers book={book} updateBook={updateBook} /> : null}</TabContent>
      </TabContents>
    </Tabs>
  );
};

export default EditBook;
