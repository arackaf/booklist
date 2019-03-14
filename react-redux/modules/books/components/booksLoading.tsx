import React, { useContext } from 'react';
import Loading from 'applicationRoot/components/loading';
import { SubjectsContext } from 'applicationRoot/renderUI';
import { BooksContext } from '../booksState';
import { TagsContext } from 'applicationRoot/tagsState';

const BooksLoading = () => {
  const { booksLoading } = useContext(BooksContext);
  const { tagsLoaded } = useContext(TagsContext);
  const { subjectsLoaded } = useContext(SubjectsContext);

  return booksLoading || !subjectsLoaded || !tagsLoaded ? <Loading /> : null;
};

export default BooksLoading;
