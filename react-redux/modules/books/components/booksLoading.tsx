import React, { useContext } from "react";
import Loading from "applicationRoot/components/loading";
import { TagsContext } from "./bookViewList";
import { SubjectsContext } from "applicationRoot/renderUI";
import { useBooks } from "../booksState";

const BooksLoading = () => {
  const { booksLoading } = useBooks();
  const [{ tagsLoaded }] = useContext(TagsContext);
  const [{ subjectsLoaded }] = useContext(SubjectsContext);

  return booksLoading || !subjectsLoaded || !tagsLoaded ? <Loading /> : null;
};

export default BooksLoading;
