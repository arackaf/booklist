import { queryBooks, updateSingleBook, updateMultipleBooks } from "./dbUtils";
import type { Book, BookDetails, BookSearch } from "./types";

const bookFields = [
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
  "smallImage",
  "smallImagePreview"
];

const bookProjections = bookFields.reduce<{ [k: string]: 1 }>((result, field) => {
  result[field] = 1;
  return result;
}, {});

export const searchBooks = async (userId: string, searchPacket: BookSearch) => {
  userId = userId || "";
  const httpStart = +new Date();

  const { search, sort } = searchPacket;

  return queryBooks({
    pipeline: [
      { $match: { title: { $regex: search || "", $options: "i" }, userId } },
      { $project: bookProjections },
      { $addFields: { dateAdded: { $toDate: "$_id" } } },
      { $limit: 50 },
      { $sort: sort ?? { _id: -1 } }
    ]
  })
    .then(books => {
      const httpEnd = +new Date();
      console.log("HTTP time books", httpEnd - httpStart);

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
      return books;
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
      console.log({ books });
      const httpEnd = +new Date();
      console.log("HTTP time books", httpEnd - httpStart);

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
      console.log("HTTP time books", httpEnd - httpStart);

      return records;
    })
    .catch(err => {
      console.log({ err });
    });
};

export const updateBook = async (userId: string, book: any) => {
  const { _id, title, tags, subjects, authors } = book;

  return updateSingleBook(userId, { _id: { $oid: _id } }, { $set: { title, tags, subjects, authors } });
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
