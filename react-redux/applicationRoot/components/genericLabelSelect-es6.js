import Autosuggest from 'react-autosuggest';
import { LabelDisplay } from 'applicationRoot/components/labelDisplay';
import React from 'react';

function getSuggestionValue(suggestion) { // when suggestion selected, this function tells what should be the value of the input
    return suggestion.name;
}

function renderSuggestion(s) {
    return (
        <LabelDisplay item={s} style={{ marginLeft: (s.childLevel * 15) + 'px' }}>
            {s.name}
        </LabelDisplay>
    );
}

class GenericLabelSelect extends React.Component {
    constructor() {
        super();

        this.onSuggestionSelected = (evt, { suggestion }) => {
            this.props.onSuggestionSelected({ ...suggestion });
            setTimeout(() => this.input.blur(), 1);
        }
    }
    render() {
        return (
            <div>
                <Autosuggest className="auto-suggest-label"
                             suggestions={this.props.suggestions}
                             shouldRenderSuggestions={() => true}
                             getSuggestionValue={getSuggestionValue}
                             onSuggestionSelected={this.onSuggestionSelected}
                             renderSuggestion={renderSuggestion}
                             ref={el => { if (el && el.input){ this.input = el.input; } }}
                             inputProps={ {...this.props.inputProps} } />
            </div>
        );
    }
}

export default GenericLabelSelect;