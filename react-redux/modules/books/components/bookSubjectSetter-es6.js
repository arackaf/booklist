import React from 'react';
import { connect } from 'react-redux';
import BootstrapButton from 'applicationRoot/rootComponents/bootstrapButton';
import AjaxButton from 'applicationRoot/rootComponents/ajaxButton';
import { booksSubjectsModifierSelector } from '../reducers/booksSubjectModification/reducer';
import * as bookSubjectActionCreators from '../reducers/booksSubjectModification/actionCreators';

import { Modal } from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';

let languages = [
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

    //if (inputLength === 0 && !force) return [];
    if (inputLength === 0) return languages.concat();
    //if (force) return languages;

    return languages.filter(lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue);
}

function getSuggestionValue(suggestion) { // when suggestion selected, this function tells what should be the value of the input
    //languages = languages.filter(s => s != suggestion);
    return suggestion.name;
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

        this.onChange = (event, { newValue }) => {
            this.setState({
                value: newValue,
                suggestions: getSuggestions(newValue)
            });
        }

        this.onSuggestionSelected = (evt, val) => {
            debugger;
            this.onChange(null, { newValue: '' });

            setTimeout(() => this.input.blur(), 1);
        }
    }

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Type a programming language',
            value,
            onChange: this.onChange
            //onFocus: (evt) => { this.setState({ suggestions: getSuggestions('') }) }
        };

        return (
            <div>
                <Autosuggest className="auto-suggest-label"
                             suggestions={suggestions}
                             shouldRenderSuggestions={() => true}
                             onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                             getSuggestionValue={getSuggestionValue}
                             onSuggestionSelected={this.onSuggestionSelected}
                             renderSuggestion={renderSuggestion}
                             ref={el => { if (el && el.input){ this.input = el.input; } }}
                             inputProps={inputProps} />
                <button xstyle={{ display: 'none' }} ref={el => this.dummy = el} />
            </div>
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