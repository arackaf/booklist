import booksPreload, { publicUserPreload, subjectsAndTagsNonPublicPreload } from "../modules/books/booksPreload";
import subjectsPreload from "../modules/subjects/subjectsPreload";

export function doModulePreload(moduleToLoad: string): void {
  switch (moduleToLoad.toLowerCase()) {
    case "view":
      publicUserPreload();
    case "books":
      publicUserPreload();
      booksPreload();
      import("../modules/books/books");

      break;
    case "scan":
      subjectsAndTagsNonPublicPreload();
      import("../modules/scan/scan");

      break;
    case "subjects":
      subjectsPreload();
      import("../modules/subjects/subjects");

      break;
  }
}
