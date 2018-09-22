import React, { Component } from "react";
import { connect } from "react-redux";

import BootstrapButton, { AjaxButton } from "applicationRoot/components/bootstrapButton";
import SelectAvailable from "applicationRoot/components/availableTagsOrSubjects";

import { filterTags, selectEntireTagsState } from "applicationRoot/rootReducer";

import { MutationType } from "reactStartup";
import { mutation } from "micro-graphql-react";

import { SET_BOOKS_TAGS } from "../reducers/books/actionNames";
import Modal from "applicationRoot/components/modal";

interface ILocalProps {
  modifyingBooks: any[];
  onDone: any;
}

@mutation(
  `mutation updateBooksTags($books: [String], $add: [String], $remove: [String]) {
    remove: updateBooks(
      _ids: $books,
      Updates: { tags_PULL: $remove }
    ) { success }

    add: updateBooks(
      _ids: $books,
      Updates: { tags_ADDTOSET: $add }
    ) { success }          
  }`
)
@connect(selectEntireTagsState)
export default class BookTagSetterDesktopUnConnected extends Component<ReturnType<typeof selectEntireTagsState> & ILocalProps & MutationType, any> {
  state = {
    currentTab: "tags",
    addingTags: [],
    removingTags: []
  };

  componentDidUpdate(prevProps, prevState) {
    if (!(prevProps.modifyingBooks || []).length && (this.props.modifyingBooks || []).length) {
      this.setState({ addingTags: [], removingTags: [] });
    }
  }

  setBooksTags = () => {
    let args = { books: this.props.modifyingBooks.map(b => b._id), add: this.state.addingTags, remove: this.state.removingTags };
    Promise.resolve(this.props.runMutation(args)).then(() => {
      this.props.dispatch({ type: SET_BOOKS_TAGS, ...args });
      this.props.onDone();
    });
  };
  addingTagSet = (adding, { _id }) => {
    this.setState({
      addingTags: adding ? this.state.addingTags.concat(_id) : this.state.addingTags.filter(x => x != _id)
    });
  };
  tagSelectedToAdd = this.addingTagSet.bind(null, true);
  removingTagSet = (adding, { _id }) => {
    this.setState({
      removingTags: adding ? this.state.removingTags.concat(_id) : this.state.removingTags.filter(x => x != _id)
    });
  };
  tagSelectedToRemove = this.removingTagSet.bind(null, true);
  resetTags = () => {
    this.setState({
      addingTags: [],
      removingTags: []
    });
  };

  render() {
    let dontAddTag = this.addingTagSet.bind(null, false);
    let dontRemoveTag = this.removingTagSet.bind(null, false);
    let modifyingBooks = this.props.modifyingBooks || [];

    return (
      <Modal className="fade" isOpen={!!modifyingBooks.length} onHide={this.props.onDone} headerCaption="Add / Remove Tags:">
        <ul className="nav nav-tabs">
          <li className={this.state.currentTab == "tags" ? "active" : ""}>
            <a onClick={() => this.setState({ currentTab: "tags" })}>Choose tags</a>
          </li>
          <li className={this.state.currentTab == "books" ? "active" : ""}>
            <a onClick={() => this.setState({ currentTab: "books" })}>For books</a>
          </li>
        </ul>
        <div className="tab-content">
          <div style={{ minHeight: "150px" }} className={"tab-pane " + (this.state.currentTab == "tags" ? "active in" : "")}>
            <br />
            <div style={{ position: "relative" }} className="row">
              <div className="col-xs-3">
                <SelectAvailable
                  placeholder="Adding"
                  items={this.props.allTagsSorted}
                  currentlySelected={this.state.addingTags}
                  onSelect={this.tagSelectedToAdd}
                  filter={filterTags}
                />
              </div>
              <div className="col-xs-9">
                <div>
                  {this.state.addingTags.map(_id => this.props.tagHash[_id]).map((s: any, i) => (
                    <span
                      key={i}
                      style={{ color: s.textColor || "white", backgroundColor: s.backgroundColor, display: "inline-table" }}
                      className="label label-default margin-left"
                    >
                      <a onClick={() => dontAddTag(s)} style={{ color: s.textColor || "white", paddingRight: "5px", marginRight: "5px" }}>
                        X
                      </a>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <br />

            <div style={{ position: "relative" }} className="row">
              <div className="col-xs-3">
                <SelectAvailable
                  placeholder="Removing"
                  items={this.props.allTagsSorted}
                  currentlySelected={this.state.removingTags}
                  onSelect={this.tagSelectedToRemove}
                  filter={filterTags}
                />
              </div>
              <div className="col-xs-9">
                <div>
                  {this.state.removingTags.map(_id => this.props.tagHash[_id]).map((s: any, i) => (
                    <span
                      key={i}
                      style={{ color: s.textColor || "white", backgroundColor: s.backgroundColor, display: "inline-table" }}
                      className="label label-default margin-left"
                    >
                      <a onClick={() => dontRemoveTag(s)} style={{ color: s.textColor || "white", paddingRight: "5px", marginRight: "5px" }}>
                        X
                      </a>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <br />
            <BootstrapButton onClick={this.resetTags} className="pull-right" preset="default-xs">
              Reset tags
            </BootstrapButton>
            <br />
          </div>
          <div style={{ minHeight: "150px" }} className={"tab-pane " + (this.state.currentTab == "books" ? "active in" : "")}>
            <br />
            <ul className="list-unstyled">
              {modifyingBooks.map(book => (
                <li key={book._id}>{book.title}</li>
              ))}
            </ul>
            <br />
          </div>
        </div>
        <AjaxButton preset="primary" running={this.props.running} runningText="Setting" onClick={this.setBooksTags}>
          Set
        </AjaxButton>
        &nbsp;
        <BootstrapButton preset="" onClick={this.props.onDone}>
          Cancel
        </BootstrapButton>
      </Modal>
    );
  }
}
