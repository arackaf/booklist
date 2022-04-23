const tag = require("persistgraphql/node_modules/graphql-tag");
const { print } = require("persistgraphql/node_modules/graphql");
const fs = require("fs");

const { addTypenameTransformer } = require("persistgraphql/lib/src/queryTransformers");

const code = `query SearchBooks(
  $page: Int
  $pageSize: Int
  $sort: BookSort
  $publicUserId: String
  $title_contains: String
  $isRead: Boolean
  $isRead_ne: Boolean
  $subjects_containsAny: [String]
  $searchChildSubjects: Boolean
  $tags_containsAny: [String]
  $authors_textContains: String
  $publisher_contains: String
  $subjects_count: Int
  $pages_lt: Int
  $pages_gt: Int
  $ver: String
  $cache: Int
) {
  allBooks(
    PAGE: $page
    PAGE_SIZE: $pageSize
    SORT: $sort
    title_contains: $title_contains
    isRead: $isRead
    isRead_ne: $isRead_ne
    subjects_containsAny: $subjects_containsAny
    searchChildSubjects: $searchChildSubjects
    tags_containsAny: $tags_containsAny
    authors_textContains: $authors_textContains
    publisher_contains: $publisher_contains
    publicUserId: $publicUserId
    subjects_count: $subjects_count
    pages_lt: $pages_lt
    pages_gt: $pages_gt
    ver: $ver
    cache: $cache
  ) {
    Books {
      _id
      title
      isbn
      ean
      pages
      mobileImage
      mobileImagePreview
      smallImage
      smallImagePreview
      mediumImage
      mediumImagePreview
      publicationDate
      subjects
      authors
      publisher
      tags
      isRead
      dateAdded
    }
    Meta {
      count
    }
  }
}
`;

let queryLookup = JSON.parse(fs.readFileSync("./extracted_queries.json"));
let queryAsString = print(tag(code));

console.log("|", queryAsString, "|");

const valFor21 = Object.entries(queryLookup).find(([query, val]) => val == 6)[0];
console.log("|", valFor21, "|");

console.log(valFor21 === queryAsString);

function junk(options) {
  return {
    name: "generic-persistgraphql",

    transform(code, id) {
      if (!/\.graphql$/.test(id)) return;

      if (!(queryAsString in queryLookup)) {
        console.log("\n\n---------------------------------\n\n");
        //console.log({ queryLookup });
        Object.entries(queryLookup).forEach(([query, val]) => {
          console.log(query, "\n", val, "\n");
        });

        console.log("\n\n---------------------------------queryAsString:\n\n");
        console.log(queryAsString);
        console.log("\n\n---------------------------------\n\n");

        console.error(`Query ${queryAsString} not found`);
        throw `Query ${queryAsString} not found`;
      }

      return {
        code: `export default ${queryLookup[queryAsString]};`,
        map: null // unless you support sourcemaps somehow
      };
    }
  };
}
