import React, { FunctionComponent, useContext } from "react";
import { RemovableLabelDisplay } from "./labelDisplay";
import { useTagsState } from "app/tagsState";

type LocalProps = { currentlySelected: string[]; onRemove: any };

const DisplaySelectedTags: FunctionComponent<LocalProps> = props => {
  const { tagHash } = useTagsState();

  return (
    <>
      {props.currentlySelected
        .filter(_id => tagHash[_id])
        .map(_id => tagHash[_id])
        .map(t => (
          <RemovableLabelDisplay key={t._id} className="margin-right" style={{ marginTop: "5px" }} item={t} doRemove={() => props.onRemove(t)} />
        ))}
    </>
  );
};

export default DisplaySelectedTags;
