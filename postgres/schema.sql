create table if not exists books
(
    id                                serial primary key,
    userId                            varchar(50)                             not null,
    dateAdded                         timestamp                               not null,
    title                             varchar(250)                            not null,
    authors                           json                                    null,
    isbn                              varchar(25)                             null,
    pages                             int                                     null,
    isRead                            boolean                                 not null,
    similarBooks                      json                                    null,
    similarBooksLastSync              timestamp default '1990-01-01 00:00:00' not null,
    similarBooksLastSyncSuccess       boolean                                 null,
    similarBooksLastSyncFailureReason text                                    null,
    syncEligible                      boolean generated always as ((case
                                                                        when ((char_length(isbn) = 10) or (char_length(isbn) = 13))
                                                                            then true
                                                                        else false end)) stored,
    mobileImage                       varchar(250)                            null,
    mobileImagePreview                json                                    null,
    smallImage                        varchar(250)                            null,
    smallImagePreview                 json                                    null,
    mediumImage                       varchar(250)                            null,
    mediumImagePreview                json                                    null,
    publicationDate                   varchar(30)                             null,
    publisher                         varchar(100)                            null,
    editorialReviews                  json                                    null
);

create index idx_dateAdded_user
    on books (dateAdded desc, userId asc);

create index idx_isbn
    on books (isbn);

create index idx_syncEligible_similarBooksLastSync_id
    on books (syncEligible desc, similarBooksLastSync asc, id asc);

create index idx_user_dateAdded
    on books (userId asc, dateAdded desc, id desc);

create index idx_user_pages
    on books (userId, pages);

create index idx_user_title
    on books (userId, title);

create table if not exists books_subjects
(
    id      serial primary key,
    userId  varchar(50) default '' null,
    book    int                    not null,
    subject int                    not null
);

create index idx_bookstags_book
    on books_subjects (book);

create index idx_bookssubjects_subject
    on books_subjects (subject);

create index idx_bookssubjects_userId_subject
    on books_subjects (userId, subject);

create table if not exists books_tags
(
    id     serial primary key,
    userId varchar(50) default '' null,
    book   int                    not null,
    tag    int                    not null
);

create index idx_book
    on books_tags (book);

create index idx_tag
    on books_tags (tag);

create index idx_userId_tag
    on books_tags (userId, tag);

create table if not exists similar_books
(
    id                    serial primary key,
    title                 varchar(250) not null,
    authors               json         null,
    authorsLastManualSync timestamp    null,
    isbn                  varchar(25)  null,
    mobileImage           varchar(250) null,
    mobileImagePreview    json         null,
    smallImage            varchar(250) null,
    smallImagePreview     json         null
);

create index idx_similarbooks_authors_last_sync
    on similar_books (authorsLastManualSync);

create index idx_similarbooks_isbn
    on similar_books (isbn);

create table if not exists subjects
(
    id              serial primary key,
    userId          varchar(50)  not null,
    name            varchar(255) not null,
    path            varchar(255) null,
    textColor       varchar(255) null,
    backgroundColor varchar(255) null
);

create index idx_subjects_user_name
    on subjects (userId, name);

create table if not exists tags
(
    id              serial primary key,
    userId          varchar(50)  not null,
    name            varchar(255) not null,
    textColor       varchar(255) null,
    backgroundColor varchar(255) null
);

create index idx_tags_user_name
    on tags (userId, name);

create table if not exists user_info_cache
(
    userId      varchar(50)  not null primary key,
    name        varchar(250) null,
    provider    varchar(50)  null,
    email       varchar(250) null,
    avatar      varchar(250) null,
    aliasUserId varchar(50)  null,
    lastSync    bigint       not null
);

