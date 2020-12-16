<script lang="ts">
  import cn from "classnames";
  import { MutationOf, Mutations } from "graphql-typings";
  import UpdateSubjectMutation from "graphQL/subjects/updateSubject.graphql";

  import colorsState from "app/state/colorsState";
  import { getEligibleParents, subjectsState } from "app/state/subjectsState";
  import { mutation } from "micro-graphql-svelte";
  import { onMount } from "svelte";
  import FlexRow from "app/components/layout/FlexRow.svelte";
  import ColorsPalette from "app/components/ui/ColorsPalette.svelte";
  import CustomColorPicker from "app/components/ui/CustomColorPicker.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import Button from "app/components/buttons/Button.svelte";

  export let editingSubject;
  export let setEditingSubject;
  export let onCancelEdit;
  export let setDeleteShowing;

  $: ({ subjectHash } = $subjectsState);
  $: ({ colors } = $colorsState);

  const { _id, name } = editingSubject;

  let inputEl;
  onMount(() => {
    inputEl.focus({ preventScroll: true });
  });

  const { mutationState } = mutation<MutationOf<Mutations["updateSubject"]>>(UpdateSubjectMutation);
  const { runMutation: updateSubject, running: isSubjectSaving } = $mutationState;

  const textColors = ["#ffffff", "#000000"];

  $: eligibleParents = getEligibleParents(subjectHash, _id) || [];

  let missingName = false;

  const setEditingSubjectFieldEvt = (prop, evt) => {
    setEditingSubjectField(prop, evt.target.value);
  };
  const setEditingSubjectField = (prop, value) => {
    if (prop == "name" && value.trim()) {
      missingName = false;
    }
    setEditingSubject(sub => ({ ...sub, [prop]: value }));
  };

  const runSave = () => {
    if (!editingSubject.name.trim()) {
      return (missingName = true);
    }

    let { _id, name, parentId, backgroundColor, textColor } = editingSubject;
    let request = { _id, name, parentId, backgroundColor, textColor };

    Promise.resolve(updateSubject(request)).then(onCancelEdit);
  };

  const subjectEditingKeyDown = evt => {
    let key = evt.keyCode || evt.which;
    if (key == 13) {
      if (!evt.target.value.trim()) {
        missingName = true;
      } else {
        runSave();
      }
    }
  };
</script>

<FlexRow>
  <div class="col-xs-12 col-lg-6">
    <div class="form-group">
      <label>Name</label>
      <input
        bind:this={inputEl}
        onKeyDown={subjectEditingKeyDown}
        on:change={evt => setEditingSubjectFieldEvt('name', evt)}
        value={editingSubject.name}
        class={cn('form-control', { error: missingName })}
      />
      {#if missingName}<span style="margin-top: 5px; display: inline-block;" class="label label-danger"> Subjects need names! </span> <br />{/if}
      <div
        class="label label-default"
        style="background-color: {editingSubject.backgroundColor}; color: {editingSubject.textColor}; max-width: 100%; overflow: hidden; align-self: flex-start;"
      >
        {editingSubject.name.trim() || '<label preview>'}
      </div>
    </div>
  </div>
  <div class="col-xs-12 col-lg-6">
    <div class="form-group">
      <label>Parent</label>
      <select on:change={evt => setEditingSubjectFieldEvt('parentId', evt)} value={editingSubject.parentId || ''} class="form-control">
        <option value="">No Parent</option>
        {#each eligibleParents as s}
          <option value={s._id}>{s.name}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="col-xs-12 col-sm-6">
    <div class="form-group">
      <label>Label Color</label>
      <ColorsPalette
        currentColor={editingSubject.backgroundColor}
        {colors}
        onColorChosen={color => setEditingSubjectField('backgroundColor', color)}
      />
      <CustomColorPicker
        labelStyle={{ marginLeft: '3px' }}
        onColorChosen={color => setEditingSubjectField('backgroundColor', color)}
        currentColor={editingSubject.backgroundColor}
      />
    </div>
  </div>
  <div class="col-xs-12 col-sm-6">
    <div class="form-group">
      <label>Text Color</label>
      <ColorsPalette
        currentColor={editingSubject.textColor}
        colors={textColors}
        onColorChosen={color => setEditingSubjectField('textColor', color)}
      />
      <CustomColorPicker
        labelStyle={{ marginLeft: '3px' }}
        onColorChosen={color => setEditingSubjectField('textColor', color)}
        currentColor={editingSubject.backgroundColor}
      />
    </div>
  </div>
  <div class="col-xs-12">
    <FlowItems pushLast={true}>
      <Button disabled={isSubjectSaving} preset="primary-xs" onClick={runSave}>
        Save
        <i class={`fa fa-fw ${isSubjectSaving ? 'fa-spinner fa-spin' : 'fa-save'}`} />
      </Button>
      <Button disabled={isSubjectSaving} preset="default-xs" onClick={onCancelEdit}>Cancel</Button>
      {#if _id}
        <Button disabled={isSubjectSaving} preset="danger-xs" onClick={() => setDeleteShowing(true)}>
          Delete
          {name}
          <i class="fa fa-fw fa-trash" />
        </Button>
      {/if}
    </FlowItems>
  </div>
</FlexRow>
