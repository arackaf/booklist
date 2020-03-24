import React, { FunctionComponent, useContext } from "react";
import { RemovableLabelDisplay } from "../LabelDisplay";
import { useTagsState } from "app/state/tagsState";
import FlowItems from "../../layout/FlowItems";

type LocalProps = { currentlySelected: string[]; onRemove: any };

const DisplaySelectedTags: FunctionComponent<LocalProps> = props => {
  const { tagHash } = useTagsState();

  return (
    <FlowItems tightest={true}>
      {props.currentlySelected
        .filter(_id => tagHash[_id])
        .map(_id => tagHash[_id])
        .map(t => (
          <RemovableLabelDisplay key={t._id} item={t} doRemove={() => props.onRemove(t)} />
        ))}
    </FlowItems>
  );
};

export default DisplaySelectedTags;
