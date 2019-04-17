import React, { SFC, useContext, useState } from "react";
import { BooksContext } from "../../booksState";
import DetailsView from "./detailView";

import coversClasses from "./coversList.module.css";

const { coversList } = coversClasses;

const BookViewCovers: SFC<any> = props => {
  const { books } = useContext(BooksContext);
  const [displaying, setDisplaying] = useState(null);
  const [detailsViewOpen, setDetailsViewOpen] = useState(false);
  const previewBook = book => {
    setDisplaying(book);
    setDetailsViewOpen(true);
  };

  const closeModal = () => setDetailsViewOpen(false);

  return (
    <div>
      <DetailsView book={displaying} isOpen={detailsViewOpen} onClose={closeModal} />
      <div style={{ padding: "15px" }}>
        <div style={{ border: 0 }} className={coversList}>
          {books.map((book, i) => (
            <figure onClick={() => previewBook(book)}>
              <img src={book.mediumImage} crossOrigin="anonymous" />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookViewCovers;
