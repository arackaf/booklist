import React, { Component, FunctionComponent, useContext } from "react";
import { RemovableLabelDisplay } from "./labelDisplay";
import { SubjectsContext } from "applicationRoot/renderUI";

type LocalProps = { currentlySelected: string[]; onRemove: any };

const DisplaySelectedSubjects: FunctionComponent<LocalProps> = props => {
  const { subjectHash } = useContext(SubjectsContext);
  return (
    <>
      {props.currentlySelected
        .map(_id => subjectHash[_id])
        .map(t => (
          <RemovableLabelDisplay key={t._id} className="margin-left" item={t} doRemove={() => props.onRemove(t)} />
        ))}
    </>
  );
};

export default DisplaySelectedSubjects;
