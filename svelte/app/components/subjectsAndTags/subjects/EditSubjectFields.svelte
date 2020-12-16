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


