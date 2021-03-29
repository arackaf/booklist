import React, { Component } from "react";

import Modal from "../ui/Modal";
import EditBook from "./editBook";

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
    let { saveBook, title } = this.props;

    return (
      <Modal className="fade" isOpen={!!this.props.isOpen} onHide={() => this.closeModal()} headerCaption={this.state.title}>
        <EditBook {...{ saveBook, title }} book={bookEditing}  />
      </Modal>
    );
  }
}

export default ManualBookEntry;
