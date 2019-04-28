import React, { useState } from "react";
import BootstrapButton, { AjaxButton } from "app/components/bootstrapButton";

const EditBookInfo = props => {
  const { book, saveBook, updateBook } = props;
  const [titleMissing, setTitleMissing] = useState(false);

  const save = () => {
    if (!book.title) {
      setTitleMissing(true);
    } else {
      setTitleMissing(false);

      //trim out empty authors now, so they're not applied in the reducer, and show up as empty entries on subsequent edits
      let bookToSave = { ...book, authors: book.authors.filter(a => a) };
      return Promise.resolve(saveBook(bookToSave)).then(savedBook => {
        savedBook && updateBook(book => ({ ...book, _id: savedBook._id }));
      });
    }
  };

  const syncAuthor = index => evt => {
    let newAuthors = book.authors.concat();
    newAuthors[index] = evt.target.value;
    updateBook(book => ({ ...book, authors: newAuthors }));
  };
  const addAuthor = evt => {
    evt.preventDefault();
    updateBook(book => ({ ...book, authors: book.authors.concat("") }));
  };

  const syncField = name => evt => updateBook(book => ({ ...book, [name]: evt.target.value }));

  return (
    <>
      <form onSubmit={evt => evt.preventDefault()}>
        <div className={"form-group " + (!book.title && titleMissing ? "has-error" : "")}>
          <label>Title</label>

          <input onChange={syncField("title")} className="form-control" value={book.title} placeholder="Title (required)" />
        </div>
        <div className="row">
          <div className="col-xs-6">
            <div className="form-group">
              <label>ISBN</label>
              <input onChange={syncField("isbn")} className="form-control" value={book.isbn} placeholder="ISBN" />
            </div>
          </div>

          <div className="col-xs-6">
            <div className="form-group">
              <label>Pages</label>
              <input onChange={syncField("pages")} className="form-control" value={book.pages} type="number" placeholder="Number of pages" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <div className="form-group">
              <label>Publisher</label>
              <input onChange={syncField("publisher")} className="form-control" value={book.publisher} placeholder="Publisher" />
            </div>
          </div>

          <div className="col-xs-6">
            <div className="form-group">
              <label>Published</label>
              <input onChange={syncField("publicationDate")} className="form-control" value={book.publicationDate} placeholder="Publication date" />
            </div>
          </div>
        </div>
        <div className="row">
          {(book.authors || []).map((author, $index) => (
            <div key={$index} className="col-xs-4">
              <div className="form-group">
                <label>Author</label>
                <input onChange={syncAuthor($index)} value={author} className="form-control" placeholder={`Author ${$index + 1}`} />
              </div>
            </div>
          ))}
          <div className="col-xs-12">
            <BootstrapButton onClick={evt => addAuthor(evt)} preset="default-xs">
              <i className="fa fa-fw fa-plus" /> Add author
            </BootstrapButton>
          </div>
        </div>
        <hr style={{ marginTop: "20px", marginBottom: "10px" }} />

        <AjaxButton className="pull-right" preset="primary" runningText="Saving" finishedText="Saved" onClick={save}>
          Save
        </AjaxButton>
      </form>
    </>
  );
};

export default EditBookInfo;
