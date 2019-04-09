import React, { SFC, useContext, useState } from "react";
import { BooksContext } from "../booksState";
import DetailsView from "./detailView";

import "./coversList.css";

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
        <div style={{ border: 0 }} className="covers-list">
          {books.map((book, i) => (
            <figure>
              <img onClick={() => previewBook(book)} src={book.mediumImage} />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookViewCovers;
