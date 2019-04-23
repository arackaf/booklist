import React, { SFC, useContext, useState } from "react";
import { BooksContext } from "../../booksState";
import DetailsView from "./detailView";
import BookEditModal from "applicationRoot/components/manualBookEntry";

import coversClasses from "./coversList.module.css";

const { coversList } = coversClasses;

const BookViewCovers: SFC<any> = props => {
  const { saveEditingBook, running: saving } = props;
  const { books } = useContext(BooksContext);
  const [displaying, setDisplaying] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [detailsViewOpen, setDetailsViewOpen] = useState(false);
  const previewBook = book => {
    setDisplaying(book);
    setDetailsViewOpen(true);
  };

  const doSave = book => {
    Promise.resolve(saveEditingBook(book)).then(() => setEditingBook(null));
  };

  const closeModal = () => setDetailsViewOpen(false);

  return (
    <div>
      <DetailsView book={displaying} isOpen={detailsViewOpen} onClose={closeModal} editBook={setEditingBook} />
      <BookEditModal
        title={editingBook ? `Edit ${editingBook.title}` : ""}
        bookToEdit={editingBook}
        isOpen={!!editingBook}
        isSaving={saving}
        isSaved={false}
        saveBook={doSave}
        saveMessage={"Saved"}
        onClosing={() => setEditingBook(null)}
      />
      <div style={{ padding: "15px" }}>
        <div style={{ border: 0 }} className={coversList}>
          {books.map((book, i) => (
            <figure onClick={() => previewBook(book)}>
              <div>
                <img src={book.mediumImage} crossOrigin="anonymous" />
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
