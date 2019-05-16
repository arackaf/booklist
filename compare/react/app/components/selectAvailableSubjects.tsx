import React, { FunctionComponent } from "react";
import SelectAvailableItems from "./availableTagsOrSubjects";
import { filterTags } from "app/tagsState";
import { useStackedSubjects } from "app/subjectsState";

type LocalProps = { currentlySelected: string[]; onSelect: any };

const SelectAvailableSubjects: FunctionComponent<LocalProps> = props => {
  const { subjectsUnwound } = useStackedSubjects();
  return (
    <SelectAvailableItems
      placeholder="Subjects"
      items={subjectsUnwound}
      currentlySelected={props.currentlySelected}
      onSelect={props.onSelect}
      filter={filterTags}
    />
  );
};

export default SelectAvailableSubjects;
