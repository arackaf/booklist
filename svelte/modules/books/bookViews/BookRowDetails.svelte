<style>
  .detailsRow {
    padding-right: 10px;
  }
  .detailsRow > * > div {
    padding-top: 10px;
    max-height: 250px;
    overflow: auto;
  }
</style>

const BookRowDetails: FunctionComponent<{ book?: IBookDisplay; setDetailsLoading: any }> = props => {
  let [{ isPublic: viewingPublic }] = useContext(AppContext);
  let { book, setDetailsLoading } = props;

  let [{ publicUserId }] = useContext(AppContext);

  let { loading, data } = useQuery<QueryOf<Queries["getBook"]>>(BookDetailsQuery, { _id: book._id, publicUserId, cache: 9 });

  setDetailsLoading(loading);
  if (loading) {
    return null;
  }

  let editorialReviews, similarBooks;
  if (data) {
    ({ editorialReviews, similarBooks } = data.getBook.Book);
  }

  return (
    <tr key={"details" + book._id}>
      <td colSpan={viewingPublic ? 8 : 9} style={{ borderTop: 0, paddingLeft: "50px", paddingTop: 0, paddingBottom: "15px" }}>
        <FlexRow class="detailsRow">
          <div class="col-xs-6">
            {!editorialReviews || !editorialReviews.length ? (
              <h4>No editorial reviews for this book</h4>
            ) : (
              <div>
                {editorialReviews.map((review, index) => (
                  <div key={index}>
                    {index > 0 ? <hr style={{ border: "2px solid #eee" }} /> : null}
                    <Stack>
                      <h4>{review.source || "<unknown source>"}</h4>
                      <div dangerouslySetInnerHTML={{ __html: review.content }} />
                    </Stack>
                  </div>
                ))}
                <br />
              </div>
            )}
          </div>

          <div class="col-xs-6">
            {!similarBooks || !similarBooks.length ? (
              <h4>No similar items found for this book</h4>
            ) : (
              <div>
                <Stack>
                  <h4>Similar Books</h4>
                  <table class="table table-condensed" style={{ backgroundColor: "transparent" }}>
                    <tbody>
                      {similarBooks.map((book, i) => (
                        <tr key={i}>
                          <td>{book.smallImage ? <CoverSmall url={book.smallImage} /> : null}</td>
                          <td>
                            <span style={{ fontWeight: "bold" }}>{book.title}</span>
                            <br />
                            {book.authors.length ? (
                              <>
                                <span style={{ fontStyle: "italic" }}>{book.authors.join(", ")}</span>
                                <br />
                              </>
                            ) : null}
                            <a target="_new" style={{ color: "black" }} href={`https://www.amazon.com/gp/product/${book.asin}/?tag=zoomiec-20`}>
                              <i class="fab fa-amazon" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Stack>
              </div>
            )}
          </div>
        </FlexRow>
      </td>
    </tr>
  );
};