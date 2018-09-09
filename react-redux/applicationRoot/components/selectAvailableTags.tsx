import React, { Component } from "react";
import SelectAvailableItems from "./availableTagsOrSubjects";
import { filterTags, selectEntireTagsState } from "../rootReducer";
import { connect } from "react-redux";

type LocalProps = { currentlySelected: string[]; onSelect: any };

@connect(selectEntireTagsState)
export default class SelectAvailableTags extends Component<Partial<LocalProps & ReturnType<typeof selectEntireTagsState>>, never> {
  render() {
    return (
      <SelectAvailableItems
        placeholder="Tags"
        items={this.props.allTagsSorted}
        currentlySelected={this.props.currentlySelected}
        onSelect={this.props.onSelect}
        filter={filterTags}
      />
    );
  }
}
