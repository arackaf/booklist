import React, { Component } from "react";
import SelectAvailableItems from "./availableTagsOrSubjects";
import { filterTags, selectEntireTagsState } from "../rootReducer";
import { connect } from "react-redux";
import { RemovableLabelDisplay } from "./labelDisplay";

type LocalProps = { currentlySelected: string[]; onRemove: any };

class DisplaySelectedTags extends Component<Partial<LocalProps & ReturnType<typeof selectEntireTagsState>>, never> {
  render() {
    return (
      <>
        {this.props.currentlySelected.map(_id => this.props.tagHash[_id]).map(t => (
          <RemovableLabelDisplay key={t._id} className="margin-left" item={t} doRemove={() => this.props.onRemove(t)} />
        ))}
      </>
    );
  }
}

export default connect(selectEntireTagsState)(DisplaySelectedTags);
