-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"date_added" timestamp NOT NULL,
	"title" varchar(250) NOT NULL,
	"authors" json,
	"isbn" varchar(25),
	"pages" integer,
	"is_read" boolean NOT NULL,
	"similar_books" json,
	"similar_books_last_sync" timestamp DEFAULT '1990-01-01 00:00:00' NOT NULL,
	"similar_books_last_sync_success" boolean,
	"similar_books_last_sync_failure_reason" text,
	"sync_eligible" boolean GENERATED ALWAYS AS (
CASE
    WHEN ((char_length((isbn)::text) = 10) OR (char_length((isbn)::text) = 13)) THEN true
    ELSE false
END) STORED,
	"mobile_image" varchar(250),
	"mobile_image_preview" json,
	"small_image" varchar(250),
	"small_image_preview" json,
	"medium_image" varchar(250),
	"medium_image_preview" json,
	"publication_date" varchar(30),
	"publisher" varchar(100),
	"editorial_reviews" json
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"path" varchar(255),
	"text_color" varchar(255),
	"background_color" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "books_subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(50) DEFAULT '',
	"book" integer NOT NULL,
	"subject" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(50) DEFAULT '',
	"book" integer NOT NULL,
	"tag" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "similar_books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(250) NOT NULL,
	"authors" json,
	"authors_last_manual_sync" timestamp,
	"isbn" varchar(25),
	"mobile_image" varchar(250),
	"mobile_image_preview" json,
	"small_image" varchar(250),
	"small_image_preview" json
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"text_color" varchar(255),
	"background_color" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "user_info_cache" (
	"user_id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(250),
	"provider" varchar(50),
	"email" varchar(250),
	"avatar" varchar(250),
	"alias_user_id" varchar(50),
	"last_sync" bigint NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_dateadded_user" ON "books" USING btree ("date_added" text_ops,"user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_isbn" ON "books" USING btree ("isbn" text_ops);--> statement-breakpoint
CREATE INDEX "idx_synceligible_similarbookslastsync_id" ON "books" USING btree ("sync_eligible" bool_ops,"similar_books_last_sync" int4_ops,"id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_user_dateadded" ON "books" USING btree ("user_id" int4_ops,"date_added" int4_ops,"id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_pages" ON "books" USING btree ("user_id" int4_ops,"pages" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_title" ON "books" USING btree ("user_id" text_ops,"title" text_ops);--> statement-breakpoint
CREATE INDEX "idx_subjects_user_name" ON "subjects" USING btree ("user_id" text_ops,"name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_bookssubjects_book_subject" ON "books_subjects" USING btree ("book" int4_ops,"subject" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_bookssubjects_subject" ON "books_subjects" USING btree ("subject" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_bookssubjects_userid_subject" ON "books_subjects" USING btree ("user_id" int4_ops,"subject" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_bookstags_book" ON "books_subjects" USING btree ("book" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_book" ON "books_tags" USING btree ("book" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_bookstags_book_tag" ON "books_tags" USING btree ("book" int4_ops,"tag" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_tag" ON "books_tags" USING btree ("tag" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_userid_tag" ON "books_tags" USING btree ("user_id" text_ops,"tag" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_similarbooks_authors_last_sync" ON "similar_books" USING btree ("authors_last_manual_sync" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_similarbooks_isbn" ON "similar_books" USING btree ("isbn" text_ops);--> statement-breakpoint
CREATE INDEX "idx_tags_user_name" ON "tags" USING btree ("user_id" text_ops,"name" text_ops);
*/