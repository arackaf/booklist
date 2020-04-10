import React, { FunctionComponent, useContext } from "react";
import { RemovableLabelDisplay } from "../LabelDisplay";
import { useSubjectsState } from "app/state/subjectsState";
import FlowItems from "../../layout/FlowItems";

type LocalProps = { currentlySelected: string[]; onRemove: any };

const DisplaySelectedSubjects: FunctionComponent<LocalProps> = props => {
  const { subjectHash } = useSubjectsState();

  return (
    <FlowItems tightest={true}>
      {props.currentlySelected
        .filter(_id => subjectHash[_id])
        .map(_id => subjectHash[_id])
        .map(t => (
          <RemovableLabelDisplay key={t._id} item={t} doRemove={() => props.onRemove(t)} />
        ))}
    </FlowItems>
  );
};

export default DisplaySelectedSubjects;
