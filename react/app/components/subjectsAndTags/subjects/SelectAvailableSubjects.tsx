import React, { FunctionComponent, useState } from "react";
import { useStackedSubjects, filterSubjects, useSubjectsState } from "app/state/subjectsState";
import GenericLabelSelect from "../genericLabelSelect";

type LocalProps = { currentlySelected: string[]; onSelect: any };

const SelectAvailableSubjects: FunctionComponent<LocalProps> = props => {
  const { subjectsUnwound } = useStackedSubjects();
  const { subjectHash } = useSubjectsState();

  const [search, setSearchValue] = useState("");
  const setSearch = evt => setSearchValue(evt.target.value);

  const onSelect = item => {
    props.onSelect(item);
    setSearchValue("");
  };

  let itemHash = props.currentlySelected.reduce((hash, _idOrObj) => ((hash[_idOrObj] = true), hash), {});

  const eligible = filterSubjects(
    subjectsUnwound,
    search,
    subjectHash,
    itemHash,
  );

  return (
    <GenericLabelSelect
      inputProps={{ tabIndex: -1, placeholder: "Subjects", value: search, onChange: setSearch }}
      suggestions={eligible}
      onSuggestionSelected={onSelect}
    />
  );
};

export default SelectAvailableSubjects;
