import React, { FunctionComponent } from "react";
import SelectAvailableItems from "../AvailableTagsOrSubjects";
import { useStackedSubjects, filterSubjects } from "app/state/subjectsState";

type LocalProps = { currentlySelected: string[]; onSelect: any };

const SelectAvailableSubjects: FunctionComponent<LocalProps> = props => {
  const { subjectsUnwound } = useStackedSubjects();
  return (
    <SelectAvailableItems
      placeholder="Subjects"
      items={subjectsUnwound}
      currentlySelected={props.currentlySelected}
      onSelect={props.onSelect}
      filter={filterSubjects}
    />
  );
};

export default SelectAvailableSubjects;
