import React, { Component } from "react";

import Modal from "../ui/Modal";
import ManageBookCover from "./manageBookCover";
import EditBookInfo from "./editBookInfo";

import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "../layout/Tabs";

class ManualBookEntry extends Component<any, any> {
  state = { tab: "basic", bookEditing: null, title: "" };

  closeModal() {
    this.props.onClosing();
  }
  componentDidMount() {
    //TODO: refactor with what's below
    if (this.props.bookToEdit) {
      this.editBook(this.props.bookToEdit);
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.bookToEdit !== prevProps.bookToEdit && this.props.bookToEdit) {
      this.editBook(this.props.bookToEdit);
    }
  }
  updateBook = updateFn => {
    this.setState({ bookEditing: updateFn(this.state.bookEditing) });
  };
  editBook(book) {
    this.setState({
      tab: "basic",
      title: this.props.title,
      bookEditing: { ...book }
    });
  }
  render() {
    let { bookEditing } = this.state;
    let { saveBook, applyNewImage } = this.props;
    let book = bookEditing;

    return (
      <Modal className="fade" isOpen={!!this.props.isOpen} onHide={() => this.closeModal()} headerCaption={this.state.title}>
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
            <TabContent tabName="basic">{book ? <EditBookInfo {...{ book, saveBook }} updateBook={this.updateBook} /> : null}</TabContent>
            <TabContent tabName="covers">
              {book ? (
                <>
                  <div className="form-group">
                    <label>Small Cover</label>
                    <ManageBookCover
                      _id={book._id}
                      imgKey="smallImage"
                      size="small"
                      img={book.smallImage}
                      updateBook={this.updateBook}
                    />
                  </div>
                  <hr />
                  <div className="form-group">
                    <label>Medium Cover</label>
                    <ManageBookCover
                      _id={book._id}
                      imgKey="mediumImage"
                      size="medium"
                      img={book.mediumImage}
                      updateBook={this.updateBook}
                    />
                  </div>
                </>
              ) : null}
            </TabContent>
          </TabContents>
        </Tabs>
      </Modal>
    );
  }
}

export default ManualBookEntry;
