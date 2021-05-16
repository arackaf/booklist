import React, { useState, FunctionComponent, useLayoutEffect } from "react";

import ManageBookCover from "./manageBookCover";
import EditBookInfo from "./editBookInfo";

import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "../layout/Tabs";
import ajaxUtil from "util/ajaxUtil";

type Props = {
  saveBook: any;
  title: string;
  book: any;
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
    if (bookToEdit) {
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
        <TabHeader tabName="basic">
          <a>Book info</a>
        </TabHeader>
        <TabHeader tabName="covers">
          <a>Covers</a>
        </TabHeader>
      </TabHeaders>
      <TabContents>
        <TabContent tabName="basic">{book ? <EditBookInfo {...{ book, onCancel, saveBook }} updateBook={updateBook} /> : null}</TabContent>
        <TabContent tabName="covers">
          {book ? (
            <>
              <div className="form-group">
                <label>Small Cover</label>
                <ManageBookCover _id={book._id} imgKey="smallImage" size="small" img={book.smallImage} updateBook={updateBook} />
              </div>
              <hr />
              <div className="form-group">
                <label>Medium Cover</label>
                <ManageBookCover _id={book._id} imgKey="mediumImage" size="medium" img={book.mediumImage} updateBook={updateBook} />
              </div>
            </>
          ) : null}
        </TabContent>
      </TabContents>
    </Tabs>
  );
};

export default EditBook;
