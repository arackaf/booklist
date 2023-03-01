import { DEFAULT_BOOKS_PAGE_SIZE, EMPTY_BOOKS_RESULTS } from "$lib/state/dataConstants";

import { queryBooks, updateMultipleBooks, deleteBookById, updateById, insertObject, mySqlConnectionFactory, getInsertLists } from "./dbUtils";
import type { Book, BookDetails, BookSearch } from "./types";
import escapeRegexp from "escape-string-regexp";

const defaultBookFields: (keyof Book)[] = [
  "id",
  "title",
  "pages",
  "userId",
  "authors",
  "isbn",
  "publisher",
  "publicationDate",
  "isRead",
  "dateAdded",
  "mobileImage",
  "mobileImagePreview",
  "smallImage",
  "smallImagePreview",
  "mediumImage",
  "mediumImagePreview"
];

const compactBookFields = ["id", "title", "authors", "isbn", "publisher", "isRead", "smallImage", "smallImagePreview"];

const getFieldProjection = (fields: string[]) =>
  fields.reduce<{ [k: string]: 1 }>((result, field) => {
    result[field] = 1;
    return result;
  }, {});

const getSort = (sortPack: any = { id: -1 }) => {
  const [rawField, rawDir] = Object.entries(sortPack)[0];
  const field = rawField === "id" ? "dateAdded" : rawField === "title" ? "title" : "pages";
  const dir = rawDir === -1 ? "DESC" : "ASC";
  return `ORDER BY ${field} ${dir}`;
};

export const searchBooks = async (userId: string, searchPacket: BookSearch) => {
  if (!userId) {
    return EMPTY_BOOKS_RESULTS;
  }
  const { page, search, publisher, author, tags, searchChildSubjects, subjects, noSubjects, isRead, sort, resultSet } = searchPacket;
  const pageSize = Math.min(searchPacket.pageSize ?? DEFAULT_BOOKS_PAGE_SIZE, 100);

  try {
    const conn = mySqlConnectionFactory.connection();

    const start = +new Date();

    const filters = ["userId = ?"];
    const args: any[] = [userId];

    if (search) {
      filters.push("title LIKE ?");
      args.push(`%${search}%`);
    }
    if (publisher) {
      filters.push("publisher LIKE ?");
      args.push(`%${publisher}%`);
    }
    if (author) {
      filters.push(`LOWER(authors->>"$") LIKE ?`);
      args.push(`%${author.toLowerCase()}%`);
    }
    if (isRead != null) {
      filters.push("isRead = ?");
      args.push(isRead);
    }
    if (tags.length) {
      filters.push("EXISTS (SELECT 1 FROM books_tags bt WHERE bt.book = b.id AND bt.tag IN (?))");
      args.push(tags);
    }
    if (subjects.length) {
      if (!searchChildSubjects) {
        filters.push("EXISTS (SELECT 1 FROM books_subjects bs WHERE bs.book = b.id AND bs.subject IN (?))");
        args.push(subjects);
      } else {
        const pathMatch = subjects.map(id => "s.path LIKE ?").join(" OR ");
        filters.push(
          `EXISTS (SELECT 1 FROM books_subjects bs JOIN subjects s ON bs.subject = s.id WHERE bs.book = b.id AND (bs.subject IN (?) OR ${pathMatch}))`
        );
        args.push(subjects, ...subjects.map(id => `%,${id},%`));
      }
    } else if (noSubjects) {
      filters.push("NOT EXISTS (SELECT 1 FROM books_subjects bs WHERE bs.book = b.id)");
    }

    const fieldsToSelect = resultSet === "compact" ? compactBookFields : defaultBookFields;
    const sortExpression = getSort(sort);

    const mainBooksProjection = `
      SELECT 
        ${fieldsToSelect.join(",")},
        (SELECT JSON_ARRAYAGG(tag) from books_tags WHERE book = b.id) tags, 
        (SELECT JSON_ARRAYAGG(subject) from books_subjects WHERE book = b.id) subjects`;
    const filterBody = `
      FROM books b 
      WHERE ${filters.join(" AND ")}`;

    const booksReq = conn.execute(`${mainBooksProjection}${filterBody} ${sortExpression} LIMIT ?`, args.concat(pageSize)) as any;
    const countReq = conn.execute(`SELECT COUNT(*) total ${filterBody}`, args) as any;

    const [booksResp, countResp] = await Promise.all([booksReq, countReq]);
    const end = +new Date();

    console.log("MySQL books time", end - start);

    const books: Book[] = booksResp.rows;
    const totalBooks = countResp.rows[0].total;
    const totalPages = Math.ceil(totalBooks / pageSize);

    const arrayFieldsToInit = ["subjects", "tags"] as (keyof Book)[];
    books.forEach(book => {
      arrayFieldsToInit.forEach(arr => {
        if (!Array.isArray(book[arr])) {
          (book as any)[arr] = [] as string[];
        }
      });

      book.isRead = (book.isRead as any) == 1;

      const date = new Date(book.dateAdded);
      book.dateAddedDisplay = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });

    return { books, totalBooks, page, totalPages };
  } catch (er) {
    console.log("er", er);
  }
};

export const searchBooksMongo = async (userId: string, searchPacket: BookSearch) => {
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
      console.log("HTTP books time A", httpEnd - httpStart);

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
      console.log("HTTP books time B", httpEnd - httpStart);

      return books[0];
    })
    .catch(err => {
      console.log({ err });
    });
};

export const aggregateBooksSubjects = async (userId: string) => {
  const start = +new Date();
  const conn = mySqlConnectionFactory.connection();
  const results = await conn.execute(
    `
    SELECT
      COUNT(*) count,
      agg.subjects
    FROM books b
    JOIN (
        SELECT
            bs.book,
            JSON_ARRAYAGG(bs.subject) subjects
        FROM books_subjects bs
        JOIN subjects s
        ON bs.subject = s.id
        GROUP BY bs.book
    ) agg
    ON b.id = agg.book
    WHERE b.userId = ?
    GROUP BY agg.subjects
    HAVING agg.subjects IS NOT NULL
  `,
    [userId]
  );

  const rows = results.rows.map((r: any) => ({ ...r, count: +r.count }));

  const end = +new Date();
  console.log("MySQL subject books aggregate time", end - start);

  return rows;
};

export const booksSubjectsDump = async (userId: string) => {
  const httpStart = +new Date();

  return queryBooks({
    pipeline: [
      { $match: { userId, "subjects.0": { $exists: true } } },
      { $group: { _id: "$subjects", count: { $count: {} } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, subjects: "$_id", count: 1 } }
    ]
  })
    .then(records => {
      const httpEnd = +new Date();
      console.log("HTTP subject books aggregate time", httpEnd - httpStart);

      return records;
    })
    .catch(err => {
      console.log({ err });
    });
};

export const insertBook = async (userId: string, book: Partial<Book>) => {
  const conn = mySqlConnectionFactory.connection();

  const res = await conn.execute(
    `
    INSERT INTO books (
      title,
      pages,
      authors,
      isbn,
      publisher,
      publicationDate,
      isRead,
      mobileImage,
      mobileImagePreview,
      smallImage,
      smallImagePreview,
      mediumImage,
      mediumImagePreview,
      userId,
      dateAdded
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      book.title,
      book.pages ?? null,
      JSON.stringify(book.authors ?? []),
      book.isbn,
      book.publisher,
      book.publicationDate,
      book.isRead ?? false,
      book.mobileImage,
      JSON.stringify(book.mobileImagePreview ?? null),
      book.smallImage,
      JSON.stringify(book.smallImagePreview ?? null),
      book.mediumImage,
      JSON.stringify(book.mediumImagePreview ?? null),
      userId,
      new Date()
    ]
  );

  console.log("DONE", res);
};

export const updateBook = async (userId: string, book: Partial<Book>) => {
  const { id, ...fields } = book;

  return updateById("books", userId, id!, { $set: { ...fields } });
};

type BulkUpdate = {
  ids: string[];
  add: string[];
  remove: string[];
};

export const updateBooksSubjects = async (userId: string, updates: BulkUpdate) => {
  const { ids, add, remove } = updates;

  const addPairs = ids.flatMap(bookId => add.map(addId => [bookId, addId]));
  const removePairs = ids.flatMap(bookId => remove.map(addId => [bookId, addId]));

  if (!addPairs.length && !removePairs.length) {
    return;
  }

  const conn = mySqlConnectionFactory.connection();
  await conn.transaction(async tx => {
    const ops = [await tx.execute(`CREATE TEMPORARY TABLE tmp (book INT NOT NULL, subject INT NOT NULL);`)];
    if (addPairs.length) {
      ops.push(
        await tx.execute(`INSERT INTO tmp (book, subject) VALUES ${getInsertLists(addPairs)};`, addPairs),
        await tx.execute(
          `
          INSERT INTO books_subjects (book, subject)
          SELECT DISTINCT tmp.book, tmp.subject
          FROM tmp
          JOIN books b
          ON tmp.book = b.id
          LEFT OUTER JOIN books_subjects existing
          ON existing.book = tmp.book AND existing.subject = tmp.subject
          WHERE b.userId = ? AND existing.book IS NULL AND existing.subject IS NULL
          `,
          [userId]
        ),
        await tx.execute(`DELETE FROM tmp`)
      );
    }
    if (removePairs.length) {
      ops.push(
        await tx.execute(`INSERT INTO tmp (book, subject) VALUES ${getInsertLists(removePairs)};`, removePairs),
        await tx.execute(
          `
          DELETE FROM books_subjects
          WHERE EXISTS (
            SELECT 1
            FROM tmp
            WHERE books_subjects.book = tmp.book AND books_subjects.subject = tmp.subject
          );
          `
        )
      );
    }

    return ops;
  });
};
export const updateBooksSubjects__mongo = async (userId: string, updates: any) => {
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
  const { ids, add, remove } = updates;

  const addPairs = ids.flatMap(bookId => add.map(addId => [bookId, addId]));
  const removePairs = ids.flatMap(bookId => remove.map(addId => [bookId, addId]));

  if (!addPairs.length && !removePairs.length) {
    return;
  }

  const conn = mySqlConnectionFactory.connection();
  await conn.transaction(async tx => {
    const ops = [await tx.execute(`CREATE TEMPORARY TABLE tmp (book INT NOT NULL, tag INT NOT NULL);`)];
    if (addPairs.length) {
      ops.push(
        await tx.execute(`INSERT INTO tmp (book, tag) VALUES ${getInsertLists(addPairs)};`, addPairs),
        await tx.execute(
          `
          INSERT INTO books_tags (book, tag)
          SELECT DISTINCT tmp.book, tmp.tag
          FROM tmp
          JOIN books b
          ON tmp.book = b.id
          LEFT OUTER JOIN books_tags existing
          ON existing.book = tmp.book AND existing.tag = tmp.tag
          WHERE b.userId = ? AND existing.book IS NULL AND existing.tag IS NULL
          `,
          [userId]
        ),
        await tx.execute(`DELETE FROM tmp`)
      );
    }
    if (removePairs.length) {
      ops.push(
        await tx.execute(`INSERT INTO tmp (book, tag) VALUES ${getInsertLists(removePairs)};`, removePairs),
        await tx.execute(
          `
          DELETE FROM books_tags
          WHERE EXISTS (
            SELECT 1
            FROM tmp
            WHERE books_tags.book = tmp.book AND books_tags.tag = tmp.tag
          );
          `
        )
      );
    }

    return ops;
  });
};
export const updateBooksTags__Mongo = async (userId: string, updates: BulkUpdate) => {
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
