import React, { FunctionComponent, useContext } from "react";
import { RemovableLabelDisplay, LabelDisplay } from "../LabelDisplay";
import { useTagsState } from "app/state/tagsState";
import FlowItems from "../../layout/FlowItems";

type LocalProps = { currentlySelected: string[]; onRemove?: any };

const DisplaySelectedTags: FunctionComponent<LocalProps> = props => {
  const { tagHash } = useTagsState();
  const { currentlySelected, onRemove } = props;

  return (
    <FlowItems tightest={true}>
      {currentlySelected
        .filter(_id => tagHash[_id])
        .map(_id => tagHash[_id])
        .map(t => (onRemove ? <RemovableLabelDisplay key={t._id} item={t} doRemove={() => onRemove(t)} /> : <LabelDisplay key={t._id} item={t} />))}
    </FlowItems>
  );
};

export default DisplaySelectedTags;
