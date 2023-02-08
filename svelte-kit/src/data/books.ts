import { queryBooks, updateMultipleBooks, deleteBookById, updateById, insertObject } from "./dbUtils";
import type { Book, BookDetails, BookSearch } from "./types";
import escapeRegexp from "escape-string-regexp";
import { DEFAULT_BOOKS_PAGE_SIZE } from "$lib/state/dataConstants";

const defaultBookFields = [
  "_id",
  "title",
  "pages",
  "userId",
  "authors",
  "tags",
  "subjects",
  "isbn",
  "publisher",
  "publicationDate",
  "isRead",
  "mobileImage",
  "mobileImagePreview",
  "smallImage",
  "smallImagePreview",
  "mediumImage",
  "mediumImagePreview"
];

const compactBookFields = ["_id", "title", "authors", "isbn", "publisher", "isRead", "smallImage", "smallImagePreview"];

const getFieldProjection = (fields: string[]) =>
  fields.reduce<{ [k: string]: 1 }>((result, field) => {
    result[field] = 1;
    return result;
  }, {});

export const EMPTY_BOOKS_RESULTS = { books: [], totalBooks: 0, page: 0, totalPages: 0 };

export const searchBooks = async (userId: string, searchPacket: BookSearch) => {
  userId = userId || "";

  if (!userId) {
    return EMPTY_BOOKS_RESULTS;
  }

  const httpStart = +new Date();

  const { page, search, publisher, author, tags, searchChildSubjects, subjects, noSubjects, isRead, sort, resultSet } = searchPacket;

  const fieldsToSelect = resultSet === "compact" ? compactBookFields : defaultBookFields;
  const projection = getFieldProjection(fieldsToSelect);

  const $match: any = { userId };
  let $lookup: any = null;

  const requiredOrs = [] as any[];

  let pageSize = searchPacket.pageSize ?? DEFAULT_BOOKS_PAGE_SIZE;
  if (pageSize > 100) {
    pageSize = DEFAULT_BOOKS_PAGE_SIZE;
  }

  const withSubjectsLookup = subjects.length && searchChildSubjects;

  if (search) {
    $match.title = { $regex: escapeRegexp(search), $options: "i" };
  }
  if (publisher) {
    $match.publisher = { $regex: escapeRegexp(publisher), $options: "i" };
  }
  if (author) {
    $match.authors = { $regex: escapeRegexp(author), $options: "i" };
  }
  if (isRead != null) {
    if (isRead) {
      $match.isRead = true;
    } else {
      requiredOrs.push([{ isRead: false }, { isRead: { $exists: false } }]);
    }
  }
  if (tags.length) {
    $match.tags = { $in: tags };
  }
  if (noSubjects) {
    requiredOrs.push([{ subjects: [] }, { subjects: { $exists: false } }]);
  } else {
    if (subjects.length && !searchChildSubjects) {
      $match.subjects = { $in: subjects };
    }
    if (withSubjectsLookup) {
      $lookup = {
        from: "subjects",
        let: { subjectsArray: "$subjects" },
        pipeline: [
          { $addFields: { subjectIdString: { $toString: "$_id" } } },
          //
          { $match: { $expr: { $in: ["$subjectIdString", { $ifNull: ["$$subjectsArray", []] }] } } }
        ],
        as: "subjectObjects"
      };

      requiredOrs.push([{ subjects: { $in: subjects } }, { "subjectObjects.path": { $regex: subjects.map(_id => `,${_id},`).join("|") } }]);
    }
  }
  if (requiredOrs.length) {
    $match.$and = requiredOrs.map(orArray => ({ $or: orArray }));
  }

  return queryBooks<{ resultsCount: [{ count: number }]; books: Book[] }>({
    pipeline: [
      $lookup ? { $lookup } : null,
      { $match },
      { $project: { ...projection, ...(withSubjectsLookup ? { subjectObjects: 1 } : {}) } },
      { $addFields: { dateAdded: { $toDate: "$_id" } } },
      { $sort: sort ?? { _id: -1 } },
      {
        $facet: {
          resultsCount: [{ $count: "count" }],
          books: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }]
        }
      }
    ].filter(x => x)
  })
    .then(results => {
      const [{ resultsCount, books }] = results;
      const totalBooks = resultsCount?.[0]?.count ?? 0;

      const httpEnd = +new Date();
      console.log("HTTP books time", httpEnd - httpStart);

      const arrayFieldsToInit = ["authors", "subjects", "tags"] as (keyof Book)[];
      books.forEach(book => {
        arrayFieldsToInit.forEach(arr => {
          if (!Array.isArray(book[arr])) {
            (book as any)[arr] = [] as string[];
          }
        });

        const date = new Date(book.dateAdded);
        book.dateAddedDisplay = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      });

      const totalPages = Math.ceil(totalBooks / pageSize);

      return { books, totalBooks, page, totalPages };
    })
    .catch(err => {
      console.log({ err });
    });
};

export const getBookDetails = async (id: string) => {
  const httpStart = +new Date();

  return queryBooks<BookDetails>({
    pipeline: [
      { $match: { _id: { $oid: id } } },
      {
        $lookup: {
          from: "bookSummaries",
          localField: "similarItems",
          foreignField: "isbn",
          as: "similarBooks",
          pipeline: [
            {
              $project: {
                _id: 0,
                title: 1,
                authors: 1,
                smallImage: 1,
                smallImagePreview: 1,
                asin: 1
              }
            }
          ]
        }
      },
      { $project: { editorialReviews: 1, similarBooks: 1 /*"$similarBooks.title": 1*/ } }
    ]
  })
    .then(books => {
      const httpEnd = +new Date();
      console.log("HTTP books time", httpEnd - httpStart);

      return books[0];
    })
    .catch(err => {
      console.log({ err });
    });
};

export const booksSubjectsDump = async (userId: string) => {
  const httpStart = +new Date();

  return queryBooks({
    pipeline: [
      { $match: { userId, "subjects.0": { $exists: true } } },
      { $group: { _id: "$subjects", count: { $count: {} } } },
      { $project: { _id: 0, subjects: "$_id", count: 1 } }
    ]
  })
    .then(records => {
      const httpEnd = +new Date();
      console.log("HTTP books time", httpEnd - httpStart);

      return records;
    })
    .catch(err => {
      console.log({ err });
    });
};

export const insertBook = async (userId: string, book: Partial<Book>) => {
  return insertObject("books", userId, book);
};

export const updateBook = async (userId: string, book: Partial<Book>) => {
  const { _id, ...fields } = book;

  return updateById("books", userId, _id!, { $set: { ...fields } });
};

type BulkUpdate = {
  _ids: string[];
  add: string[];
  remove: string[];
};

export const updateBooksSubjects = async (userId: string, updates: BulkUpdate) => {
  const { _ids, add, remove } = updates;

  if (add.length) {
    await updateMultipleBooks(
      userId,
      { _id: { $in: _ids.map(_id => ({ $oid: _id })) } },
      {
        $addToSet: { subjects: { $each: add } }
      }
    );
  }

  if (remove.length) {
    await updateMultipleBooks(
      userId,
      { _id: { $in: _ids.map(_id => ({ $oid: _id })) } },
      {
        $pull: { subjects: { $in: remove } }
      }
    );
  }
};

export const updateBooksTags = async (userId: string, updates: BulkUpdate) => {
  const { _ids, add, remove } = updates;

  if (add.length) {
    await updateMultipleBooks(
      userId,
      { _id: { $in: _ids.map(_id => ({ $oid: _id })) } },
      {
        $addToSet: { tags: { $each: add } }
      }
    );
  }
  if (remove.length) {
    await updateMultipleBooks(
      userId,
      { _id: { $in: _ids.map(_id => ({ $oid: _id })) } },
      {
        $pull: { tags: { $in: remove } }
      }
    );
  }
};

export const updateBooksRead = async (userId: string, _ids: string[], read: boolean) => {
  await updateMultipleBooks(userId, { _id: { $in: _ids.map(_id => ({ $oid: _id })) } }, { $set: { isRead: read } });
};

export const deleteBook = async (userId: string, _id: string) => {
  await deleteBookById(userId, _id);
};
