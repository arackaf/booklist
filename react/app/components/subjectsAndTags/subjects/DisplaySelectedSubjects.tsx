import React, { FunctionComponent, useContext } from "react";
import { RemovableLabelDisplay, LabelDisplay } from "../LabelDisplay";
import { useSubjectsState } from "app/state/subjectsState";
import FlowItems from "../../layout/FlowItems";

type LocalProps = { currentlySelected: string[]; onRemove?: any };

const DisplaySelectedSubjects: FunctionComponent<LocalProps> = props => {
  const { subjectHash } = useSubjectsState();
  const { currentlySelected, onRemove } = props;

  return (
    <FlowItems tightest={true}>
      {currentlySelected
        .filter(_id => subjectHash[_id])
        .map(_id => subjectHash[_id])
        .map(t => (onRemove ? <RemovableLabelDisplay key={t._id} item={t} doRemove={() => onRemove(t)} /> : <LabelDisplay key={t._id} item={t} />))}
    </FlowItems>
  );
};

export default DisplaySelectedSubjects;
