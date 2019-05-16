import React, { useContext } from "react";
import Loading from "app/components/loading";
import { SubjectsContext } from "app/renderUI";
import { BooksContext } from "../booksState";
import { TagsContext } from "app/tagsState";

const BooksLoading = () => {
  const { booksLoading } = useContext(BooksContext);
  const { tagsLoaded } = useContext(TagsContext);
  const { subjectsLoaded } = useContext(SubjectsContext);

  return booksLoading || !subjectsLoaded || !tagsLoaded ? <Loading /> : null;
};

export default BooksLoading;
