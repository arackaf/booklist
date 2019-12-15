import React, { FunctionComponent, useContext } from "react";
import { RemovableLabelDisplay } from "./labelDisplay";
import { useSubjectsState } from "app/subjectsState";

type LocalProps = { currentlySelected: string[]; onRemove: any };

const DisplaySelectedSubjects: FunctionComponent<LocalProps> = props => {
  const { subjectHash } = useSubjectsState();

  return (
    <>
      {props.currentlySelected
        .filter(_id => subjectHash[_id])
        .map(_id => subjectHash[_id])
        .map(t => (
          <RemovableLabelDisplay key={t._id} className="margin-right" style={{ marginTop: "5px" }} item={t} doRemove={() => props.onRemove(t)} />
        ))}
    </>
  );
};

export default DisplaySelectedSubjects;
