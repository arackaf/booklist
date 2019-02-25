import React, { FunctionComponent } from "react";
import SelectAvailableItems from "./availableTagsOrSubjects";
import { filterTags } from "applicationRoot/tagsState";

type LocalProps = { currentlySelected: string[]; onSelect: any };

const SelectAvailableSubjects: FunctionComponent<LocalProps> = props => {
  return (
    <SelectAvailableItems
      placeholder="Subjects"
      items={this.props.subjectsUnwound}
      currentlySelected={this.props.currentlySelected}
      onSelect={this.props.onSelect}
      filter={filterTags}
    />
  );
};

export default SelectAvailableSubjects;
