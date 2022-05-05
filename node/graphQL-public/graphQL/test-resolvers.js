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
    `{allBooks(LIMIT:1){Books{_id ean isbn title smallImage smallImagePreview mediumImage mediumImagePreview userId publisher publicationDate pages authors subjects tags isRead dateAdded editorialReviews {source,content} similarItems}}}`,
    "Book",
    "_id ean isbn title smallImage smallImagePreview mediumImage mediumImagePreview userId publisher publicationDate pages authors subjects tags isRead dateAdded editorialReviews {source,content} similarItems"
  ).catch(error => console.error(error));
  await processQuery(
    `{allLabelColors(LIMIT:1){LabelColors{_id backgroundColor order}}}`,
    "LabelColor",
    "_id backgroundColor order"
  ).catch(error => console.error(error));
  await processQuery(
    `{allSubjects(LIMIT:1){Subjects{_id name path userId backgroundColor textColor}}}`,
    "Subject",
    "_id name path userId backgroundColor textColor"
  ).catch(error => console.error(error));
  await processQuery(
    `{allTags(LIMIT:1){Tags{_id name path userId backgroundColor textColor}}}`,
    "Tag",
    "_id name path userId backgroundColor textColor"
  ).catch(error => console.error(error));

  // await processQuery(`mutation:{Book("_id ean isbn title smallImage smallImagePreview mediumImage mediumImagePreview userId publisher publicationDate pages authors subjects tags isRead dateAdded editorialReviews {source,content} similarItems")}`," mutation Book", "").catch((error) => console.error(error))
  // await processQuery(`mutation:{Subject("_id name path userId backgroundColor textColor")}`," mutation Subject", "").catch((error) => console.error(error))
  // await processQuery(`mutation:{Tag("_id name path userId backgroundColor textColor")}`," mutation Tag", "")
  // .catch((error) => console.error(error))
};
runQueries().catch(error => console.error(error));
