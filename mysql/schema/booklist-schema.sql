DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    userId                  VARCHAR(50) NOT NULL,
    dateAdded               DATETIME NOT NULL,
    title                   VARCHAR(250) NOT NULL,
    authors                 JSON,
    isbn                    VARCHAR(25),
    pages                   INT,
    isRead                  BOOL NOT NULL,
    similarBooks            JSON,
    similarBooksLastSync    DATE,
    mobileImage             VARCHAR(250),
    mobileImagePreview      JSON,
    smallImage              VARCHAR(250),
    smallImagePreview       JSON,
    mediumImage             VARCHAR(250),
    mediumImagePreview      JSON,
    publicationDate         VARCHAR(30),
    publisher               VARCHAR(100),
    editorialReviews        JSON
);
CREATE INDEX idx_isbn ON books (isbn);
CREATE INDEX idx_similarBooksLastSync ON books (similarBooksLastSync DESC);
CREATE INDEX idx_user_dateAdded ON books (userId, dateAdded DESC);
CREATE INDEX idx_user_title ON books (userId, title);
CREATE INDEX idx_user_pages ON books (userId, pages);

DROP TABLE IF EXISTS similar_books;
CREATE TABLE IF NOT EXISTS similar_books (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    title               VARCHAR(250) NOT NULL,
    authors             JSON,
    isbn                VARCHAR(25),
    smallImage          VARCHAR(250),
    smallImagePreview   JSON
);
CREATE INDEX idx_isbn ON similar_books (isbn);

DROP TABLE IF EXISTS subjects;
CREATE TABLE subjects
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    userId          VARCHAR(50) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    path            VARCHAR(255),
    textColor       VARCHAR(255),
    backgroundColor VARCHAR(255)
);
CREATE INDEX idx_user_name ON subjects(userId, name);

DROP TABLE IF EXISTS tags;
CREATE TABLE tags
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    userId          VARCHAR(50) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    textColor       VARCHAR(255),
    backgroundColor VARCHAR(255)
);
CREATE INDEX idx_user_name ON tags(userId, name);

DROP TABLE IF EXISTS books_subjects;
CREATE TABLE books_subjects
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    book        INT NOT NULL,
    subject     INT NOT NULL
);
CREATE INDEX idx_book ON books_subjects(book);
CREATE INDEX idx_subject ON books_subjects(subject);

DROP TABLE IF EXISTS books_tags;
CREATE TABLE books_tags
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    book        INT NOT NULL,
    tag        INT NOT NULL
);
CREATE INDEX idx_book ON books_tags(book);
CREATE INDEX idx_tag ON books_tags(tag);


