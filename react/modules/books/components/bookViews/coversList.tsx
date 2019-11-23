import React, { SFC, useState, Suspense } from "react";
import { useBooks } from "../../booksState";
import LazyModal from "app/components/lazyModal";

const BookEditModal = LazyModal(() => import(/* webpackChunkName: "book-view-edit-modals" */ "app/components/editBook/editModal"));
const DetailsView = LazyModal(() => import(/* webpackChunkName: "book-view-edit-modals" */ "./detailView"));

import coversClasses from "./coversList.module.scss";
import { CoverMedium } from "app/components/bookCoverComponent";
import Loading from "app/components/loading";
import { useCodeSplitModal } from "modules/books/util";

const { coversList } = coversClasses;

const BookViewCovers: SFC<any> = props => {
  const { saveEditingBook } = props;
  const { books } = useBooks();
  const [displaying, setDisplaying] = useState(null);

  const [bookPreviewing, openBookPreview, closeBookPreview] = useCodeSplitModal(null);
  const [bookEditing, openBookEditModalWith, closeBookEdit] = useCodeSplitModal(null);

  const previewBook = book => {
    setDisplaying(book);
    openBookPreview();
  };

  const doSave = book => {
    Promise.resolve(saveEditingBook(book)).then(() => closeBookEdit());
  };

  const closeModal = () => closeBookPreview(false);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <DetailsView book={displaying} isOpen={bookPreviewing} onClose={closeModal} editBook={openBookEditModalWith} />

        <BookEditModal
          title={bookEditing ? `Edit ${bookEditing.title}` : ""}
          bookToEdit={bookEditing}
          isOpen={!!bookEditing}
          saveBook={doSave}
          saveMessage={"Saved"}
          onClosing={() => openBookEditModalWith(null)}
        />
      </Suspense>
      <div>
        <div style={{ border: 0 }} className={coversList}>
          {books.map((book, i) => (
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
