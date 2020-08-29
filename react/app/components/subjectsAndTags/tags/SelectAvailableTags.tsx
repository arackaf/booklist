import React, { FunctionComponent, useContext, useState } from "react";
import { filterTags, useTagsState } from "app/state/tagsState";
import GenericLabelSelect from "../genericLabelSelect";

type LocalProps = { currentlySelected: string[]; onSelect: any; placeholder?: string };

const SelectAvailableTags: FunctionComponent<LocalProps> = props => {
  const { tags } = useTagsState();
  const [search, setSearchValue] = useState("");

  const setSearch = evt => setSearchValue(evt.target.value);

  const onSelect = item => {
    props.onSelect(item);
    setSearchValue("");
  };

  let { placeholder = "Tags", currentlySelected } = props;
  let itemHash = currentlySelected.reduce((hash, _idOrObj) => ((hash[_idOrObj] = true), hash), {});
  let eligible = filterTags(
    tags.filter(s => !itemHash[s._id]),
    search
  );

  return (
    <GenericLabelSelect
      inputProps={{ tabIndex: -1, placeholder, value: search, onChange: setSearch }}
      suggestions={eligible}
      onSuggestionSelected={onSelect}
    />
  );
};

export default SelectAvailableTags;
