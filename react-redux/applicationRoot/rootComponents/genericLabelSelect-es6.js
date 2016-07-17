import Autosuggest from 'react-autosuggest';

function getSuggestionValue(suggestion) { // when suggestion selected, this function tells what should be the value of the input
    return suggestion.name;
}

function renderSuggestion(s) {
    return (
        <span style={{ backgroundColor: s.backgroundColor, color: s.textColor || 'white', marginLeft: (s.childLevel * 15) + 'px' }} className="label label-default">
            {s.name}
        </span>
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