import React, { PureComponent } from "react";

import GenericLabelSelect from "./genericLabelSelect";

interface Props {
  placeholder: string;
  items: any;
  currentlySelected: any;
  onSelect: any;
  filter: Function;
}
export default class SelectAvailableItems extends PureComponent<Props, any> {
  state = { search: "" };
  setSearch = evt => this.setState({ search: evt.target.value });
  onSelect = item => {
    this.props.onSelect(item);
    this.setState({ search: "" });
  };
  render() {
    let { placeholder, items, currentlySelected, filter } = this.props;
    let { search } = this.state;
    let itemHash = currentlySelected.reduce((hash, _idOrObj) => ((hash[_idOrObj._id || _idOrObj] = true), hash), {});
    let eligible = filter(items.filter(s => !itemHash[s._id]), search);

    return (
      <GenericLabelSelect
        inputProps={{ tabIndex: -1, placeholder, value: search, onChange: this.setSearch }}
        suggestions={eligible}
        onSuggestionSelected={this.onSelect}
      />
    );
  }
}
