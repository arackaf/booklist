import { GraphQLClient } from "graphql-request";
const endpoint = process.env.GRAPHQL_URL;
const token = process.env.AUTH_TOKEN;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${token}`
  }
});
async function processQuery(query, name, fields, variables = {}) {
  return new Promise(async (resolve, reject) => {
    console.log(`doing ${name}`);
    const { data, errors, extensions, headers, status } = await graphQLClient.rawRequest(query);
    if (status === 200) {
      console.log(name + "passed");
      console.table(data);
      resolve(name);
    } else {
      console.error(JSON.stringify({ fields, name, errors, extensions, headers, status }));
      reject(errors);
    }
  });
}
const runQueries = async () => {
  await processQuery(
    `{allBooks(LIMIT:1){Books{_id ean isbn title smallImage smallImagePreview mediumImage mediumImagePreview userId publisher publicationDate pages authors subjects tags isRead dateAdded editorialReviews {source,content} similarItems similarItemsLastUpdate timestamp}}}`,
    "Book",
    "_id ean isbn title smallImage smallImagePreview mediumImage mediumImagePreview userId publisher publicationDate pages authors subjects tags isRead dateAdded editorialReviews {source,content} similarItems similarItemsLastUpdate timestamp"
  ).catch(error => console.error(error));
  await processQuery(
    `{allBookSummarys(LIMIT:1){BookSummarys{_id title asin isbn ean smallImage mediumImage authors}}}`,
    "BookSummary",
    "_id title asin isbn ean smallImage mediumImage authors"
  ).catch(error => console.error(error));
  await processQuery(
    `{allBooksDeleteds(LIMIT:1){BooksDeleteds{_id userId deletedTimestamp}}}`,
    "BooksDeleted",
    "_id userId deletedTimestamp"
  ).catch(error => console.error(error));
  await processQuery(
    `{allLabelColors(LIMIT:1){LabelColors{_id backgroundColor order}}}`,
    "LabelColor",
    "_id backgroundColor order"
  ).catch(error => console.error(error));
  await processQuery(
    `{allSubjects(LIMIT:1){Subjects{_id name path userId backgroundColor textColor timestamp}}}`,
    "Subject",
    "_id name path userId backgroundColor textColor timestamp"
  ).catch(error => console.error(error));
  await processQuery(
    `{allSubjectsDeleteds(LIMIT:1){SubjectsDeleteds{_id userId deletedTimestamp}}}`,
    "SubjectsDeleted",
    "_id userId deletedTimestamp"
  ).catch(error => console.error(error));
  await processQuery(
    `{allTags(LIMIT:1){Tags{_id name path userId backgroundColor textColor timestamp}}}`,
    "Tag",
    "_id name path userId backgroundColor textColor timestamp"
  ).catch(error => console.error(error));
  await processQuery(
    `{allTagsDeleteds(LIMIT:1){TagsDeleteds{_id userId deletedTimestamp}}}`,
    "TagsDeleted",
    "_id userId deletedTimestamp"
  ).catch(error => console.error(error));

  // await processQuery(`mutation:{Book("_id ean isbn title smallImage smallImagePreview mediumImage mediumImagePreview userId publisher publicationDate pages authors subjects tags isRead dateAdded editorialReviews {source,content} similarItems similarItemsLastUpdate timestamp")}`," mutation Book", "").catch((error) => console.error(error))
  // await processQuery(`mutation:{BookSummary("_id title asin isbn ean smallImage mediumImage authors")}`," mutation BookSummary", "").catch((error) => console.error(error))
  // await processQuery(`mutation:{Subject("_id name path userId backgroundColor textColor timestamp")}`," mutation Subject", "").catch((error) => console.error(error))
  // await processQuery(`mutation:{Tag("_id name path userId backgroundColor textColor timestamp")}`," mutation Tag", "")
  // .catch((error) => console.error(error))
};
runQueries().catch(error => console.error(error));
