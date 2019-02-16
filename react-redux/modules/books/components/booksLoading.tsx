import React, { useContext } from "react";
import Loading from "applicationRoot/components/loading";
import { TagsContext, BooksContext } from "./bookViewList";
import { SubjectsContext } from "applicationRoot/renderUI";

const BooksLoading = () => {
  const [{ booksLoading }] = useContext(BooksContext);
  const [{ tagsLoaded }] = useContext(TagsContext);
  const [{ subjectsLoaded }] = useContext(SubjectsContext);

  return booksLoading || !subjectsLoaded || !tagsLoaded ? <Loading /> : null;
};

export default BooksLoading;
