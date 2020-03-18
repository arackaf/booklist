import React, { FunctionComponent, useState, useContext } from "react";

import BootstrapButton, { AjaxButton } from "app/components/bootstrapButton";
import CustomColorPicker from "app/components/customColorPicker";
import GenericLabelSelect from "app/components/genericLabelSelect";
import ColorsPalette from "app/components/colorsPalette";
import Modal from "app/components/modal";

import UpdateTag from "graphQL/tags/updateTag.graphql";
import CreateTag from "graphQL/tags/createTag.graphql";
import DeleteTagMutation from "graphQL/tags/deleteTag.graphql";

import { useMutation, buildMutation } from "micro-graphql-react";
import { filterTags, useTagsState } from "app/tagsState";
import { MutationOf, Mutations } from "graphql-typings";
import { useColors } from "app/colorsState";
import Stack from "app/components/layout/Stack";
import FlowItems from "app/components/layout/FlowItems";
import FlexRow from "app/components/layout/FlexRow";

interface ILocalProps {
  onDone: any;
  editModalOpen: boolean;
}

const TagEditModal: FunctionComponent<ILocalProps> = props => {
  const [state, setStateRaw] = useState({
    editingTag: null,
    editingTagName: "",
    tagSearch: "",
    deletingId: ""
  } as any);

  const setState = newState => {
    if (typeof newState === "function") {
      setStateRaw(newState);
    } else {
      setStateRaw(state => ({ ...state, ...newState }));
    }
  };

  const setTagSearch = value => setState({ tagSearch: value });

  const newTag = () => startEditing({ _id: "", name: "", backgroundColor: "", textColor: "" });
  const editTag = tag => {
    startEditing(tag);
    setTagSearch("");
  };
  const startEditing = tag => setState({ editingTag: tag, editingTagName: tag.name, deletingId: "" });
  const cancelTagEdit = () => setState({ editingTag: null, deletingId: "" });

  const setNewTagName = value => setEditingValue("name", value);
  const setNewTagBackgroundColor = value => setEditingValue("backgroundColor", value);
  const setNewTagTextColor = value => setEditingValue("textColor", value);
  const setEditingValue = (name, value) => setState(state => ({ ...state, editingTag: { ...state.editingTag, [name]: value } }));

  const { runMutation: updateTag } = useMutation<MutationOf<Mutations["updateTag"]>>(buildMutation(UpdateTag));
  const { runMutation: createTag } = useMutation<MutationOf<Mutations["createTag"]>>(buildMutation(CreateTag));
  const { runMutation: deleteTag } = useMutation<MutationOf<Mutations["deleteTag"]>>(buildMutation(DeleteTagMutation));

  const createOrUpdateTag = () => {
    const { editingTag } = state;
    setState({ saving: true });

    const { _id, name, backgroundColor, textColor } = editingTag;
    const variables: any = { _id: _id || void 0, name, backgroundColor, textColor };
    const promise = _id ? updateTag(variables) : createTag(variables);

    (promise as any).then((resp: any) => {
      cancelTagEdit();
      setTagSearch("");
      setState({ saving: false });
    });
  };

  const runDelete = () =>
    Promise.resolve(deleteTag({ _id: state.editingTag._id })).then(() => {
      cancelTagEdit();
    });

  let { tags } = useTagsState();

  let { colors } = useColors();
  let { onDone, editModalOpen } = props;
  let { editingTag, editingTagName, tagSearch, deletingId } = state;
  let textColors = ["#ffffff", "#000000"];

  let deletingTag = deletingId ? tags.find(t => t._id == deletingId) : null;
  let deleteInfo = deletingTag ? { _id: deletingTag._id, name: deletingTag.name } : null;
  let searchedTags = filterTags(tags, tagSearch);

  return (
    <Modal isOpen={!!editModalOpen} onHide={onDone} headerCaption="Edit tags">
      <Stack>
        <FlowItems pushLast={true} xsFlowReverse={true}>
          <GenericLabelSelect
            inputProps={{ tabIndex: "-1", placeholder: "Edit tag", value: tagSearch, onChange: evt => setTagSearch(evt.target.value) }}
            suggestions={searchedTags}
            onSuggestionSelected={item => editTag(item)}
          />
          <BootstrapButton onClick={newTag} preset="info-xs">
            <span className="visible-xs">Add new tag </span>
            <i className="fa fa-fw fa-plus-square" />
          </BootstrapButton>
        </FlowItems>

        {editingTag ? (
          <div>
            {/*deleteInfo ? (
              <div className="row">
                <div className="col-xs-12">
                  <h4 style={{ marginBottom: "15px", fontSize: "16px" }}>Delete tag {editingTagName}</h4>

                  <div style={{ display: "flex" }}>
                    <AjaxButton runningText="Deleting" finishedText="Deleted" onClick={runDelete} preset="danger-xs">
                      Delete
                    </AjaxButton>
                    <BootstrapButton onClick={() => setState({ deletingId: "" })} preset="default-xs" style={{ marginLeft: "auto" }}>
                      Cancel
                    </BootstrapButton>
                  </div>
                  <hr />
                </div>
              </div>
            ) : null*/}
            <FlexRow>
              <div className="col-xs-12 col-sm-6">
                <div className="form-group">
                  <label>Tag name</label>
                  <input className="form-control" value={editingTag.name} onChange={evt => setNewTagName(evt.target.value)} />
                  <div
                    className="label label-default"
                    style={{ backgroundColor: editingTag.backgroundColor, color: editingTag.textColor, alignSelf: "flex-start" }}
                  >
                    {editingTag.name.trim() || "<label preview>"}
                  </div>
                </div>
              </div>
              <div className="col-xs-6 hidden-xs"></div>
              <div className="col-xs-12 col-sm-6">
                <div className="form-group">
                  <label>Label color</label>
                  <ColorsPalette currentColor={editingTag.backgroundColor} colors={colors} onColorChosen={setNewTagBackgroundColor} />
                  <CustomColorPicker
                    labelStyle={{ marginLeft: "3px" }}
                    onColorChosen={setNewTagBackgroundColor}
                    currentColor={editingTag.backgroundColor}
                  />
                </div>
              </div>
              <div className="col-xs-12 col-sm-6">
                <div className="form-group">
                  <label>Text color</label>
                  <ColorsPalette colors={textColors} onColorChosen={setNewTagTextColor} />
                  <CustomColorPicker
                    labelStyle={{ marginLeft: "3px" }}
                    onColorChosen={setNewTagTextColor}
                    currentColor={editingTag.backgroundColor}
                  />
                </div>
              </div>

              <div className="col-xs-12">
                <FlowItems pushLast={true}>
                  <BootstrapButton disabled={state.saving} preset="primary-xs" onClick={createOrUpdateTag}>
                    Save <i className={`fa fa-fw ${state.saving ? "fa-spinner fa-spin" : "fa-save"}`} />
                  </BootstrapButton>
                  <BootstrapButton disabled={state.saving} preset="default-xs" onClick={cancelTagEdit}>
                    Cancel
                  </BootstrapButton>
                  <BootstrapButton disabled={state.saving} onClick={e => setState({ deletingId: editingTag._id })} preset="danger-xs">
                    <i className="fa fa-fw fa-trash" />
                  </BootstrapButton>
                </FlowItems>
              </div>
            </FlexRow>
          </div>
        ) : null}
        <hr />
      </Stack>
      <BootstrapButton onClick={onDone}>Close</BootstrapButton>
    </Modal>
  );
};

export default TagEditModal;
