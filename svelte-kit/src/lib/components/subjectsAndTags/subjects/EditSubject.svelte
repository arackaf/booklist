<script lang="ts">
	import { onMount } from 'svelte';
	import cn from 'classnames';

	//import { subjectsState, getEligibleParents, computeSubjectParentId, childMapSelector } from 'app/state/subjectsState';

	//import colorsState from 'app/state/colorsState';

	import Stack from 'app/components/layout/Stack.svelte';
	import FlexRow from 'app/components/layout/FlexRow.svelte';
	import ColorsPalette from 'app/components/ui/ColorsPalette.svelte';
	import CustomColorPicker from 'app/components/ui/CustomColorPicker.svelte';
	import FlowItems from 'app/components/layout/FlowItems.svelte';
	import Button from 'app/components/buttons/Button.svelte';
	import { writable } from 'svelte/store';

	export let subject: any;
	export let onCancelEdit: any;

	// const { mutationState: updateMutationState } = mutation<MutationOf<Mutations['updateSubject']>>(UpdateSubjectMutation);
	// $: updateState = $updateMutationState;

	// const { mutationState: deleteMutationState } = mutation<MutationOf<Mutations['deleteSubject']>>(DeleteSubjectMutation);
	//let deleteState = writable({} as any);
	// $: deleteState = $deleteMutationState;
	// const deleteIt = () => deleteState.runMutation({ _id: editingSubject._id }).then(onCancelEdit);
	const deleteIt = () => {};

	const textColors = ['#ffffff', '#000000'];

	export let deleteShowing = false;
	let missingName = false;
	let inputEl: any;

	let originalName = '';

	onMount(() => {
		inputEl.focus({ preventScroll: true });

		return () => {
			deleteShowing = false;
		};
	});

	//let editingSubject = { ...subject, parentId: computeSubjectParentId(subject.path) };

	//$: editingSubjectChanged(subject);
	//$: childSubjects = $childMapSelector[editingSubject?._id] || [];
	//$: ({ subjectHash } = $subjectsState);

	let colorsState = writable({ colors: {} });
	$: ({ colors } = $colorsState);
	// $: eligibleParents = getEligibleParents(subjectHash, editingSubject._id) || [];
	// $: {
	// 	if (editingSubject.name) {
	// 		missingName = false;
	// 	}
	// }

	function editingSubjectChanged(subject: any) {
		// editingSubject = { ...subject, parentId: computeSubjectParentId(subject.path) };
		// missingName = false;
		// deleteShowing = false;
		// originalName = subject.name;
	}

	const runSave = () => {
		// if (!editingSubject.name.trim()) {
		// 	return (missingName = true);
		// }
		// let { _id, name, parentId, backgroundColor, textColor } = editingSubject;
		// let request = { _id, name, parentId, backgroundColor, textColor };
		//Promise.resolve(updateState.runMutation(request)).then(onCancelEdit);
	};

	let editingSubject: any = null;
	let eligibleParents = [] as any[];
	let updateState = {} as any;
	let deleteState = {} as any;
	let childSubjects = [] as any[];
</script>

{#if !editingSubject}
	<div />
{:else}
	<FlexRow>
		{#if !deleteShowing}
			<FlexRow>
				<div class="col-xs-12 col-lg-6">
					<div class="form-group">
						<label>Name</label>
						<input bind:this={inputEl} bind:value={editingSubject.name} class={cn('form-control', { error: missingName })} />
						{#if missingName}
							<span style="margin-top: 5px; display: inline-block;" class="label label-danger"> Subjects need names! </span>
							<br />
						{/if}
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
						<select bind:value={editingSubject.parentId} class="form-control">
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
						<ColorsPalette currentColor={editingSubject.backgroundColor} {colors} onColorChosen={color => (editingSubject.backgroundColor = color)} />
						<CustomColorPicker
							labelStyle="margin-left: 3px"
							onColorChosen={color => (editingSubject.backgroundColor = color)}
							currentColor={editingSubject.backgroundColor}
						/>
					</div>
				</div>
				<div class="col-xs-12 col-sm-6">
					<div class="form-group">
						<label>Text Color</label>
						<ColorsPalette currentColor={editingSubject.textColor} colors={textColors} onColorChosen={color => (editingSubject.textColor = color)} />
						<CustomColorPicker
							labelStyle="margin-left: 3px"
							onColorChosen={color => (editingSubject.textColor = color)}
							currentColor={editingSubject.backgroundColor}
						/>
					</div>
				</div>
				<div class="col-xs-12">
					<FlowItems pushLast={true}>
						<Button disabled={updateState.running} preset="primary-xs" onClick={runSave}>
							Save
							<i class={`far fa-fw ${updateState.running ? 'fa-spinner fa-spin' : 'fa-save'}`} />
						</Button>
						<Button disabled={updateState.running} preset="default-xs" onClick={onCancelEdit}>Cancel</Button>
						{#if editingSubject._id}
							<Button disabled={updateState.running} preset="danger-xs" onClick={() => (deleteShowing = true)}>
								Delete
								{originalName}
								<i class="far fa-fw fa-trash" />
							</Button>
						{/if}
					</FlowItems>
				</div>
			</FlexRow>
		{:else}
			<div class="col-xs-12">
				<Stack>
					<div class="alert alert-danger alert-slim" style="align-self: flex-start">
						<FlowItems tighter={true}>
							<span>Delete {editingSubject.name}?</span>
							{#if childSubjects?.length}<strong>Child subjects will also be deleted!</strong>{/if}
						</FlowItems>
					</div>
					<FlowItems>
						<Button disabled={deleteState.running} onClick={deleteIt} preset="danger-xs">
							{#if deleteState.running}<span> Deleting <i class="far fa-spinner fa-spin" /> </span>{:else}"Delete it!"{/if}
						</Button>
						<Button disabled={deleteState.running} onClick={() => (deleteShowing = false)} class="btn btn-xs">Cancel</Button>
					</FlowItems>
				</Stack>
			</div>
		{/if}
	</FlexRow>
{/if}
