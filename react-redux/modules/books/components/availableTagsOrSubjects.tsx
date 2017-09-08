import React, { PureComponent } from "react";

import GenericLabelSelect from "applicationRoot/components/genericLabelSelect";

interface Props {
  placeholder: string;
  search: string;
  onSearchChange: any;
  items: any;
  currentlySelected: any;
  onSelect: any;
  filter: Function;
}
export default class SelectAvailableItems extends PureComponent<Props, any> {
  render() {
    let { placeholder, search, onSearchChange, items, currentlySelected, onSelect, filter } = this.props,
      itemHash = currentlySelected.reduce((hash, _idOrObj) => ((hash[_idOrObj._id || _idOrObj] = true), hash), {}),
      eligible = filter(items.filter(s => !itemHash[s._id]), search);

    return (
      <GenericLabelSelect
        inputProps={{ placeholder, value: search, onChange: evt => onSearchChange(evt.target.value) }}
        suggestions={eligible}
        onSuggestionSelected={onSelect}
      />
    );
  }
}
