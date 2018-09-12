import React, { Component } from "react";
import SelectAvailableItems from "./availableTagsOrSubjects";
import { filterTags, selectStackedSubjects } from "../rootReducer";
import { connect } from "react-redux";

type LocalProps = { currentlySelected: string[]; onSelect: any };

@connect(selectStackedSubjects)
export default class SelectAvailableSubjects extends Component<Partial<LocalProps & ReturnType<typeof selectStackedSubjects>>, never> {
  render() {
    return (
      <SelectAvailableItems
        placeholder="Subjects"
        items={this.props.subjectsUnwound}
        currentlySelected={this.props.currentlySelected}
        onSelect={this.props.onSelect}
        filter={filterTags}
      />
    );
  }
}
