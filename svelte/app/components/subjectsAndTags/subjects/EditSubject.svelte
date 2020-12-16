<script lang="ts">
  import cn from "classnames";
  import { MutationOf, Mutations } from "graphql-typings";
  import { subjectsState, getEligibleParents, computeSubjectParentId, childMapSelector } from "app/state/subjectsState";

  import UpdateSubjectMutation from "graphQL/subjects/updateSubject.graphql";
  import DeleteSubjectMutation from "graphQL/subjects/deleteSubject.graphql";
  import colorsState from "app/state/colorsState";

  import EditSubjectFields from "./EditSubjectFields.svelte";
  import CustomColorPicker from "../../ui/CustomColorPicker.svelte";
  import ColorsPalette from "../../ui/ColorsPalette.svelte";

  import FlexRow from "../../layout/FlexRow.svelte";
  import FlowItems from "../../layout/FlowItems.svelte";
  import Stack from "../../layout/Stack.svelte";
  import Button from "../../buttons/Button.svelte";

  let deleteShowing = false;

  export let subject;
  export let onCancelEdit;

  $: childSubjects = $childMapSelector[subject?._id] || [];

  let editingSubject = null;
  let setEditingSubject = cb => editingSubject = cb(editingSubject);
  let setDeleteShowing = val => deleteShowing = val;

  $: {
    editingSubject = { ...subject, parentId: computeSubjectParentId(subject.path) };
    deleteShowing = false;
  }
</script>

{#if !editingSubject}
  <div />
{:else}
  <FlexRow>
    {#if !deleteShowing}
      <EditSubjectFields {...{ editingSubject, setEditingSubject, onCancelEdit, setDeleteShowing }} />
    {:else}
      <div class="col-xs-12">
        <!-- <PendingDeleteSubjectDisplay {childSubjects} {subject} onDelete={onCancelEdit} cancel={() => setDeleteShowing(false)} /> -->
      </div>
    {/if}
  </FlexRow>
  <div>TODO</div>
{/if}

<!-- 
  );
};

const PendingDeleteSubjectDisplay = props => {
  const { subject, cancel, childSubjects, onDelete } = props;
  const { name, _id } = subject;

  const { runMutation, running } = useMutation<MutationOf<Mutations["deleteSubject"]>>(DeleteSubjectMutation);
  const deleteIt = () => runMutation({ _id }).then(onDelete);

  return (
    <Stack>
      <div class="alert alert-danger alert-slim" style={{ alignSelf: "flex-start" }}>
        <FlowItems tighter={true}>
          <span>Delete {name}?</span>
          {childSubjects?.length ? <strong>Child subjects will also be deleted!</strong> : null}
        </FlowItems>
      </div>
      <FlowItems>
        <Button disabled={running} onClick={deleteIt} preset="danger-xs">
          {running ? (
            <span>
              Deleting <i class="fa fa-spinner fa-spin"></i>
            </span>
          ) : (
            "Delete it!"
          )}
        </Button>
        <Button disabled={running} onClick={cancel} class="btn btn-xs">
          Cancel
        </Button>
      </FlowItems>
    </Stack>
  );
};



export default EditSubject; -->
