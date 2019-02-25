import React, { Component, FunctionComponent } from "react";
import SelectAvailableItems from "./availableTagsOrSubjects";
import { filterTags } from "applicationRoot/tagsState";

type LocalProps = { currentlySelected: string[]; onSelect: any };

const SelectAvailableTags: FunctionComponent<LocalProps> = props => {
  return (
    <SelectAvailableItems
      placeholder="Tags"
      items={this.props.allTagsSorted}
      currentlySelected={this.props.currentlySelected}
      onSelect={this.props.onSelect}
      filter={filterTags}
    />
  );
};

export default SelectAvailableTags;
