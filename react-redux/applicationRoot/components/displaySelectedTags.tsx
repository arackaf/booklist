import React, { FunctionComponent, useContext } from 'react';
import { RemovableLabelDisplay } from './labelDisplay';
import { TagsContext } from 'applicationRoot/tagsState';

type LocalProps = { currentlySelected: string[]; onRemove: any };

const DisplaySelectedTags: FunctionComponent<LocalProps> = props => {
  const { tagHash } = useContext(TagsContext);

  return (
    <>
      {props.currentlySelected
        .map(_id => tagHash[_id])
        .map(t => (
          <RemovableLabelDisplay key={t._id} className="margin-left" item={t} doRemove={() => props.onRemove(t)} />
        ))}
    </>
  );
};

export default DisplaySelectedTags;
