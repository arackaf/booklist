import React from 'react';
import { Modal } from 'react-bootstrap';

import { bookSearch } from '../model/bookStore';
import { observer } from "mobx-react";

const InputForPending = props => {
    let name = props.name,
        updateMethod = bookSearch.setPendingField.bind(bookSearch, name);
    return <input { ...props } className="form-control" onKeyDown={updateMethod} onChange={updateMethod} value={bookSearch.pendingSearch[name]} />;
}

@observer
class BookSearchModal extends React.Component{
    render(){
        return (
            <Modal show={bookSearch.searchChanging} onHide={bookSearch.endSearchChange}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Full search
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Title</label>
                                    <InputForPending name="search" placeholder="Search title" />
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Pages</label>
                                    <div className="form-inline">
                                        <div style={{ marginRight: 10 }} className="form-group">
                                            <select onChange={bookSearch.setPendingPagesOperator} value={bookSearch.pendingSearch.pagesOperator} className="form-control">
                                                <option value="lt">{'<'}</option>
                                                <option value="gt">{'>'}</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <InputForPending name="pages" type="number" placeholder="Number of pages" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Publisher</label>
                                    <InputForPending name="publisher" placeholder="Publisher" />
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="form-group">
                                    <label>Author</label>
                                    <InputForPending name="author" placeholder="Author" />
                                </div>
                            </div>
                        </div>
                    </form>

                    { null &&
                    <div className="row" style={{ position: 'relative' }}>
                        <div className="col-xs-3">
                            <GenericLabelSelect
                                inputProps={{ placeholder: 'Tags', value: this.props.searchTagsValue, onChange: this.props.setSearchSubjectsValue }}
                                suggestions={this.props.eligibleFilterTags}
                                onSuggestionSelected={this.props.addPendingTag} />
                        </div>
                        <div className="col-xs-9">
                            <div>
                                {this.props.pendingSelectedTags.map(t =>
                                    <RemovableLabelDisplay className="margin-left" item={t} doRemove={() => this.props.removePendingTag(t._id)} />)}
                            </div>
                        </div>
                    </div> }

                    <br />

                    { null &&
                    <div className="row" style={{ position: 'relative' }}>
                        <div className="col-xs-3">
                            <GenericLabelSelect
                                inputProps={{ placeholder: 'Subjects', value: this.props.searchSubjectsValue, onChange: this.props.setSearchSubjectsValue }}
                                suggestions={this.props.eligibleFilterSubjects}
                                onSuggestionSelected={this.props.addPendingSubject} />
                        </div>
                        <div className="col-xs-9">
                            <div>
                                {this.props.pendingSelectedSubjects.map(s =>
                                    <RemovableLabelDisplay className="margin-left" item={s} doRemove={() => this.props.removePendingSubject(s._id)} />)}
                            </div>
                        </div>
                    </div> }

                    <div className="checkbox">
                        <label>
                            <input type="checkbox" onChange={bookSearch.setPendingSearchChildSubjects} checked={bookSearch.pendingSearch.searchChildSubjects} /> Also search child subjects
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <BootstrapButton preset="primary" className="pull-left" onClickX={'this.props.applyFilters'}>Filter</BootstrapButton>
                    <BootstrapButton preset="default" onClick={bookSearch.endSearchChange}>Close</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}