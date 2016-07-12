import React from 'react';
import { connect } from 'react-redux';
import BootstrapButton from 'applicationRoot/rootComponents/bootstrapButton';
import AjaxButton from 'applicationRoot/rootComponents/ajaxButton';
import { booksSubjectsModifierSelector } from '../reducers/booksSubjectModification/reducer';
import * as bookSubjectActionCreators from '../reducers/booksSubjectModification/actionCreators';

import { Modal } from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';

const languages = [
    {
        name: 'C',
        year: 1972
    },
    {
        name: 'Elm',
        year: 2012
    },
    {
        name: 'C#',
        year: 2003
    },
    {
        name: 'Java',
        year: 1996
    }
];

function getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : languages.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
}

function getSuggestionValue(suggestion) { // when suggestion selected, this function tells
    return suggestion.name;                 // what should be the value of the input
}

function renderSuggestion(suggestion) {
    return (
        <span>{suggestion.name}</span>
    );
}

class Example extends React.Component {
    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: getSuggestions('')
        };

        this.onChange = this.onChange.bind(this);
        this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    }

    onChange(event, { newValue }) {
        this.setState({
            value: newValue
        });
    }

    onSuggestionsUpdateRequested({ value }) {
        this.setState({
            suggestions: getSuggestions(value)
        });
    }

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Type a programming language',
            value,
            onChange: this.onChange
        };

        return (
            <Autosuggest className="auto-suggest-label"
                         suggestions={suggestions}
                         onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                         getSuggestionValue={getSuggestionValue}
                         renderSuggestion={renderSuggestion}
                         inputProps={inputProps} />
        );
    }
}

class BookSubjectSetterDesktopUnConnected extends React.Component {
    setBooksSubjects(){
        this.props.setBooksSubjects(
            this.props.modifyingBooks.map(b => b._id),
            this.props.addingSubjects.map(s => s._id),
            this.props.removingSubjects.map(s => s._id));
    }
    render(){
        return (
            <Modal show={!!this.props.modifyingBooks.length} onHide={this.props.cancelBookSubjectModification}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit subjects for:
                        <div>{ this.props.modifyingBooks.map(book => <h5 key={book._id}>{book.title}</h5>) }</div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Example />

                    <div>
                        <BootstrapButton preset="primary-xs" className="pull-right" onClick={this.props.subjectModificationClearSubjects}>Reset subjects</BootstrapButton>
                    </div>
                    <br />
                    <div>
                        <b>Add</b> { this.props.addingSubjects.map(subject => <span className="label label-primary" style={{ marginRight: 5, display: 'inline-block' }} key={subject._id}>{subject.name}</span>) }
                    </div>
                    <div className="panel panel-default" style={{ maxHeight: 150, overflow: 'scroll' }}>
                        <div className="panel-body" style={{ paddingTop: 0 }}>
                            { this.props.allSubjectsSorted.map(s =>
                                <div className="checkbox" key={s._id}>
                                    <label><input type="checkbox" checked={!!this.props.addingSubjectIds[s._id]} onChange={() => this.props.toggleSubjectModificationAdd(s._id)}/> {s.name}</label>
                                </div>)
                            }
                        </div>
                    </div>

                    <div>
                        <b>Remove</b> { this.props.removingSubjects.map(subject => <span className="label label-primary" style={{ marginRight: 5, display: 'inline-block' }} key={subject._id}>{subject.name}</span>) }
                    </div>
                    <div className="panel panel-default" style={{ maxHeight: 150, overflow: 'scroll' }}>
                        <div className="panel-body" style={{ paddingTop: 0 }}>
                            { this.props.allSubjectsSorted.map(s =>
                                <div className="checkbox" key={s._id}>
                                    <label><input type="checkbox" checked={!!this.props.removingSubjectIds[s._id]} onChange={() => this.props.toggleSubjectModificationRemove(s._id)}/> {s.name}</label>
                                </div>)
                            }
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <AjaxButton preset="primary" running={this.props.settingBooksSubjects} runningText='Setting' onClick={() => this.setBooksSubjects()}>Set</AjaxButton>
                    <BootstrapButton preset="" onClick={this.props.cancelBookSubjectModification}>Cancel</BootstrapButton>
                </Modal.Footer>
            </Modal>
        );
    }
}

const BookSubjectSetterDesktop = connect(booksSubjectsModifierSelector, { ...bookSubjectActionCreators })(BookSubjectSetterDesktopUnConnected);

export default BookSubjectSetterDesktop;