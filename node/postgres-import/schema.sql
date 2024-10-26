create table if not exists books
(
    id                                      serial primary key,
    user_id                                 varchar(50)                             not null,
    date_added                              timestamp                               not null,
    title                                   varchar(250)                            not null,
    authors                                 json                                    null,
    isbn                                    varchar(25)                             null,
    pages                                   int                                     null,
    is_read                                 boolean                                 not null,
    similar_books                           json                                    null,
    similar_books_last_sync                 timestamp default '1990-01-01 00:00:00' not null,
    similar_books_last_sync_success         boolean                                 null,
    similar_books_last_sync_failure_reason text                                    null,
    sync_eligible                           boolean generated always as ((case
                                                                        when ((char_length(isbn) = 10) or (char_length(isbn) = 13))
                                                                            then true
                                                                        else false end)) stored,
    mobile_image                            varchar(250)                            null,
    mobile_image_preview                    json                                    null,
    small_image                             varchar(250)                            null,
    small_image_preview                     json                                    null,
    medium_image                            varchar(250)                            null,
    medium_image_preview                    json                                    null,
    publication_date                        varchar(30)                             null,
    publisher                               varchar(100)                            null,
    editorial_reviews                       json                                    null
);

create index idx_dateadded_user
    on books (date_added desc, user_id asc);

create index idx_isbn
    on books (isbn);

create index idx_synceligible_similarbookslastsync_id
    on books (sync_eligible desc, similar_books_last_sync asc, id asc);

create index idx_user_dateadded
    on books (user_id asc, date_added desc, id desc);

create index idx_user_pages
    on books (user_id, pages);

create index idx_user_title
    on books (user_id, title);

create table if not exists books_subjects
(
    id      serial primary key,
    user_id  varchar(50) default '' null,
    book    int                    not null,
    subject int                    not null
);

create index idx_bookstags_book
    on books_subjects (book);

create index idx_bookssubjects_subject
    on books_subjects (subject);

create index idx_bookssubjects_userid_subject
    on books_subjects (user_id, subject);

create unique index idx_bookssubjects_book_subject
    on books_subjects (book, subject);

create table if not exists books_tags
(
    id      serial primary key,
    user_id varchar(50) default '' null,
    book    int                    not null,
    tag     int                    not null
);

create index idx_book
    on books_tags (book);

create index idx_tag
    on books_tags (tag);

create index idx_userid_tag
    on books_tags (user_id, tag);

create unique index idx_bookstags_book_tag
    on books_tags (book, tag);

create table if not exists similar_books
(
    id                          serial primary key,
    title                       varchar(250) not null,
    authors                     json         null,
    authors_last_manual_sync    timestamp    null,
    isbn                        varchar(25)  null,
    mobile_image                varchar(250) null,
    mobile_image_preview        json         null,
    small_image                 varchar(250) null,
    small_image_preview         json         null
);

create index idx_similarbooks_authors_last_sync
    on similar_books (authors_last_manual_sync);

create index idx_similarbooks_isbn
    on similar_books (isbn);

create table if not exists subjects
(
    id               serial primary key,
    user_id          varchar(50)  not null,
    name             varchar(255) not null,
    path             varchar(255) null,
    text_color       varchar(255) null,
    background_color varchar(255) null
);

create index idx_subjects_user_name
    on subjects (user_id, name);

create table if not exists tags
(
    id               serial primary key,
    user_id          varchar(50)  not null,
    name             varchar(255) not null,
    text_color       varchar(255) null,
    background_color varchar(255) null
);

create index idx_tags_user_name
    on tags (user_id, name);

create table if not exists user_info_cache
(
    user_id         varchar(50)  not null primary key,
    name            varchar(250) null,
    provider        varchar(50)  null,
    email           varchar(250) null,
    avatar          varchar(250) null,
    alias_user_id   varchar(50)  null,
    last_sync       bigint       not null
);

