import booksPreload, { subjectsAndTagsNonPublicPreload } from "../modules/books/booksPreload";
import subjectsPreload from "../modules/subjects/subjectsPreload";

export function getModulePreloadFunction(moduleToLoad: string): Function {
  switch (moduleToLoad.toLowerCase()) {
    case "books":
    case "view":
      return booksPreload;
    case "scan":
      return subjectsAndTagsNonPublicPreload;
    case "subjects":
      return subjectsPreload;
  }
}
