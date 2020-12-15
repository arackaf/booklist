import Autosuggest from "react-autosuggest";
import { LabelDisplay } from "app/components/subjectsAndTags/LabelDisplay";
import React, { Component } from "react";

function getSuggestionValue(suggestion) {
  // when suggestion selected, this function tells what should be the value of the input
  return suggestion.name;
}

function renderSuggestion(item) {
  let effectiveChildLevel = item.childLevel - (item.prepend || []).length;
  return (
    <span style={{ marginLeft: `${effectiveChildLevel * 15}px` }}>
      {(item.prepend || []).map(s => (
        <>
          <LabelDisplay style={{ marginRight: "5px", cursor: "pointer" }} item={s} disabled={true} />
          <i className="fal fa-level-up" style={{ transform: `rotate(90deg) translateX(2px)`, margin: `0 7px 0 3px` }}></i>
        </>
      ))}
      <LabelDisplay style={{ cursor: "pointer" }} item={item} />
    </span>
  );
}

interface ILabelShape {
  _id: string;
  name: string;
}

interface IPropsShape {
  inputProps: any;
  suggestions: ILabelShape[];
  onSuggestionSelected: (x: ILabelShape) => any;
}

class GenericLabelSelect extends Component<IPropsShape, any> {
  input: any;
  state = { suggestions: [] };
  onSuggestionSelected = (evt, { suggestion }) => {
    this.props.onSuggestionSelected({ ...suggestion });
    setTimeout(() => this.input.blur(), 1);
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.suggestions != this.props.suggestions && this.state.suggestions.length) {
      this.setState({ suggestions: this.props.suggestions });
    }
  }
  render() {
    return (
      <div>
        <Autosuggest
          alwaysRenderSuggestions={true}
          className="auto-suggest-label"
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={({ value, reason }) => this.setState({ suggestions: this.props.suggestions })}
          onSuggestionsClearRequested={() => this.setState({ suggestions: [] })}
          shouldRenderSuggestions={() => true}
          getSuggestionValue={getSuggestionValue}
          onSuggestionSelected={this.onSuggestionSelected}
          renderSuggestion={renderSuggestion}
          ref={el => {
            if (el && el.input) {
              this.input = el.input;
            }
          }}
          inputProps={{ ...this.props.inputProps }}
        />
      </div>
    );
  }
}

export default GenericLabelSelect;
