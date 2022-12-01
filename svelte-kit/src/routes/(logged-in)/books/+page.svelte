<script context="module" lang="ts">
	const initialBooksState = { selectedBooks: {}, savingReadForBooks: {}, pendingDelete: {}, deleting: {} };
	const keysToHash = (_ids: string[], value: boolean) => (Array.isArray(_ids) ? _ids : [_ids]).reduce((o: any, _id) => ((o[_id] = value), o), {});

	function booksUiStateReducer(state: any, [action, payload = null]: [string, any]) {
		switch (action) {
			case 'select':
				return { ...state, selectedBooks: { ...state.selectedBooks, ...keysToHash(payload, true) } };
			case 'de-select':
				return { ...state, selectedBooks: { ...state.selectedBooks, ...keysToHash(payload, false) } };
			case 'toggle-select':
				return { ...state, selectedBooks: { ...state.selectedBooks, [payload]: !state.selectedBooks[payload] } };
			case 'start-delete':
				return { ...state, pendingDelete: { ...state.pendingDelete, ...keysToHash(payload, true) } };
			case 'cancel-delete':
				return { ...state, pendingDelete: { ...state.pendingDelete, ...keysToHash(payload, false) } };
			case 'delete':
				return { ...state, deleting: { ...state.deleting, [payload]: true } };
			case 'reset':
				return { ...initialBooksState };
			default:
				throw 'Invalid key';
		}
	}
</script>

<script lang="ts">
	import { setContext } from 'svelte';

	import useReducer from '$lib/state/useReducer';
	import { writable } from 'svelte/store';
	import ModuleLoading from '$lib/components/navigation/ModuleLoading.svelte';

	import AutoSuggest from 'svelte-helpers/AutoSuggest.svelte';
	import Modal from 'svelte-helpers/Modal.svelte';

	import GridView from './bookViews/GridView.svelte';
	// import BasicView from './bookViews/BasicView.svelte';
	// import CoversView from './bookViews/CoversView.svelte';

	// import BookSearchModal from './SearchModal.svelte';
	import BooksMenuBar from './menuBar/MenuBar.svelte';
	// import { searchBooks } from './booksState';
	import { /*getBookSearchUiView,*/ GRID_VIEW, BASIC_LIST_VIEW, COVERS_LIST } from './booksUiState';
	// import SubjectEditModal from './SubjectEditModal.svelte';
	// import TagEditModal from './TagEditModal.svelte';
	// import EditBookModal from 'app/components/editBook/EditBookModal.svelte';
	// import BookSubjectSetter from './BookSubjectSetter.svelte';
	// import BookTagSetter from './BookTagSetter.svelte';
	// import ModuleLoading from 'app/components/navigation/ModuleLoading.svelte';

	// const { mutationState: deleteBookState } = mutation<MutationOf<Mutations['deleteBook']>>(DeleteBookMutation);
	// const deleteBook = $deleteBookState.runMutation;

	// const { mutationState: updateMutationState } =
	// 	mutation<MutationOf<Mutations['updateBooks']>>(UpdateBooksReadMutation);
	// const setRead = (_ids, isRead) => Promise.resolve($updateMutationState.runMutation({ _ids, isRead }));

	// const { mutationState: runBookEditState } = mutation<MutationOf<Mutations['updateBook']>>(UpdateBookMutation);

	import { getStores, navigating, page, updated } from '$app/stores';

	//TODO: TEMP
	import DisplaySubject from './DisplaySubject.svelte';
	import { searchState } from './searchState';

	const prepBookForSaving = (book: any) => {
		let propsToUpdate = ['title', 'isbn', 'smallImage', 'pages', 'publisher', 'publicationDate', 'authors', 'subjects', 'tags'];
		let pages = parseInt(book.pages, 10);
		book.pages = isNaN(pages) ? void 0 : pages;

		return propsToUpdate.reduce((obj, prop) => ((obj[prop] = book[prop]), obj), {} as any);
	};

	// const saveEditingBook = (book: any) => {
	// 	const bookInput = prepBookForSaving(book);
	// 	return Promise.resolve($runBookEditState.runMutation({ _id: book._id, book: bookInput }));
	// };

	let menuBarHeight = 0;
	const setMenuBarHeight = (val: number) => (menuBarHeight = val);

	const uiView = writable({ pending: false, view: GRID_VIEW });
	//const uiView = getBookSearchUiView();
	//const booksState = searchBooks(uiView);
	const booksState = writable({
		books: [],
		booksLoaded: false,
		totalPages: 0,
		resultsCount: 0,
		currentQuery: '',
		reload: () => {},
		booksLoading: false
	});
	$: ({ /*books,*/ booksLoaded, totalPages, resultsCount, currentQuery, reload, booksLoading } = $booksState);

	let filterModalOpen = false;
	let openFilterModal = () => (filterModalOpen = true);

	let editSubjectsModalOpen = false;
	let editSubjects = () => (editSubjectsModalOpen = true);

	let editTagsModalOpen = false;
	let editTags = () => (editTagsModalOpen = true);

	const [booksUiState, dispatchBooksUiState] = useReducer(booksUiStateReducer, initialBooksState);

	let editBookModalOpen = false;
	let editingBook: any = null;
	const editBook = (book: any) => {
		editingBook = book;
		editBookModalOpen = true;
	};

	let booksSubjectEditing = [] as any[];
	const editBooksSubjects = (books: any[]) => (booksSubjectEditing = books);

	let booksTagEditing = [] as any[];
	const editBooksTags = (books: any[]) => (booksTagEditing = books);

	let booksModuleContext = {
		openFilterModal,
		editSubjects,
		editTags,
		booksUiState,
		dispatchBooksUiState,
		deleteBook: () => {},
		setRead: () => {},
		editBook,
		editBooksSubjects,
		editBooksTags,
		saveEditingBook: () => {}
	};
	setContext('books-module-context', booksModuleContext);

	const stopEditingBook = () => {
		editBookModalOpen = false;
	};

	let isOpen = false;

	$: books = $page.data.books;
</script>

{#if booksLoading || $uiView.pending}
	<ModuleLoading />
{/if}

<section class="full flush-bottom">
	<div style="background-color: white;">
		<BooksMenuBar {setMenuBarHeight} {uiView} />

		<div>
			<div class="overlay-holder" style="flex: 1; padding: 0px; grid-template-columns: 100%">
				{#if booksLoaded}
					{#if !books?.length}
						<div>
							<div class="alert alert-warning" style="margin-top: 20px">No books found</div>
						</div>
					{:else if booksLoaded && books != null}
						<div>
							<!-- {#if $uiView.view == GRID_VIEW} -->
							<GridView {booksState} {menuBarHeight} />
							<!-- {:else if $uiView.view == BASIC_LIST_VIEW}
								<BasicView {booksState} />
							{:else if $uiView.view == COVERS_LIST}
								<CoversView {booksState} />
							{/if} -->
						</div>
					{/if}
				{/if}

				<!-- {#if filterModalOpen}
					<BookSearchModal isOpen={filterModalOpen} onHide={() => (filterModalOpen = false)} />
				{/if}
				{#if editSubjectsModalOpen}
					<SubjectEditModal isOpen={editSubjectsModalOpen} onHide={() => (editSubjectsModalOpen = false)} />
				{/if}
				{#if editTagsModalOpen}
					<TagEditModal isOpen={editTagsModalOpen} onHide={() => (editTagsModalOpen = false)} />
				{/if}
				{#if editingBook}
					<EditBookModal saveBook={saveEditingBook} isOpen={editBookModalOpen} book={editingBook} onSave={stopEditingBook} onHide={stopEditingBook} />
				{/if}
				{#if !!booksSubjectEditing.length}
					<BookSubjectSetter isOpen={!!booksSubjectEditing.length} onHide={() => (booksSubjectEditing = [])} modifyingBooks={booksSubjectEditing} />
				{/if}
				{#if !!booksTagEditing.length}
					<BookTagSetter isOpen={!!booksTagEditing.length} onHide={() => (booksTagEditing = [])} modifyingBooks={booksTagEditing} />
				{/if} -->
			</div>

			<div style="display: flex; flex-direction: row">
				<table style="flex: 1; padding: 10px">
					<tbody>
						<!-- {#each $page.data.books as book} -->

						{#each books as book}
							<tr>
								<td>{book.title}</td>
								<td>{book.userId}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<div style="flex: 1; padding: 10px">
					<form>
						<input type="hidden" name="search" value={$searchState.search} />
						{#each $page.data.subjects.allSubjectsSorted as subject}
							<div>
								{subject.name}

								<input type="checkbox" name="subjects" value={subject._id} checked={$searchState.subjectsLookup.has(subject._id)} />
							</div>
						{/each}
						<button>Go</button>
					</form>

					<hr />

					<ul>
						{#each $page.data.subjects.stackedSubjects as subject}
							<li>
								<DisplaySubject {subject} />
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<hr />

			{#each $page.data.tags as tag}
				<span>{tag.name}|</span>
			{/each}
		</div>
	</div>
</section>

<!-- <AutoSuggest onItemSelected={() => {}} filterField="name" />

<button on:click={() => (isOpen = true)}>Open</button>
<Modal open={isOpen} on:close={() => (isOpen = false)}>
	<div>
		<h1>Hi there</h1>
	</div>
</Modal> -->
<style>
	:global(ul) {
		margin-left: 20px !important;
	}
	:global(li) {
		list-style: circle !important;
	}
	:global(.bookTitle) {
		font-size: 15px;
		font-weight: normal;
	}

	:global(.bookAuthor) {
		font-size: 14px;
		font-weight: normal;
		color: var(--neutral-light-text);
	}
</style>
