import React, { Component } from "react";
import { selectStackedSubjects } from "../rootReducer";
import { connect } from "react-redux";
import { RemovableLabelDisplay } from "./labelDisplay";

type LocalProps = { currentlySelected: string[]; onRemove: any };

@connect(selectStackedSubjects)
export default class DisplaySelectedSubjects extends Component<Partial<LocalProps & ReturnType<typeof selectStackedSubjects>>, never> {
  render() {
    return (
      <>
        {this.props.currentlySelected.map(_id => this.props.subjectHash[_id]).map(t => (
          <RemovableLabelDisplay key={t._id} className="margin-left" item={t} doRemove={() => this.props.onRemove(t)} />
        ))}
      </>
    );
  }
}
