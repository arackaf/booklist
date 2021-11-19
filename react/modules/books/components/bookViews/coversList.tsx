import React, { useState, Suspense, useContext, FunctionComponent } from "react";

import DetailsView from "./detailView";

import "./coversList.scss";
import { CoverMedium } from "app/components/bookCoverComponent";
import Loading from "app/components/loading";
import { useCodeSplitModal } from "modules/books/util";
import { BooksModuleContext } from "modules/books/booksState";

const BookViewCovers: FunctionComponent<{ books: any }> = props => {
  const { actions } = useContext(BooksModuleContext);
  const { saveEditingBook } = actions;

  const [displaying, setDisplaying] = useState(null);
  const [bookPreviewing, openBookPreview, closeBookPreview] = useCodeSplitModal(null);

  const previewBook = book => {
    setDisplaying(book);
    openBookPreview();
  };

  const doSave = book => {
    Promise.resolve(saveEditingBook(book)).then(() => closeModal());
  };

  const closeModal = () => closeBookPreview(false);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <DetailsView book={displaying} isOpen={bookPreviewing} saveBook={doSave} onClose={closeModal} />
      </Suspense>
      <div>
        <div style={{ border: 0 }} className="bookview-covers-list-root">
          {props.books.map((book, i) => (
            <figure onClick={() => previewBook(book)}>
              <div>
                <CoverMedium url={book.mediumImage} />
              </div>
              <figcaption>{book.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookViewCovers;
