<script>
  export let books;
</script>

<div>
  <table>
    <thead>
      <tr>
        <th />
        <th>Title</th>
        <th>Authors</th>
      </tr>
    </thead>
    <tbody>
      {#each books as book}
        <tr>
          <td>
            <img alt="" src={book.smallImage} />
          </td>
          <td>{book.title}</td>
          <td>{(book.authors || []).join(', ')}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
