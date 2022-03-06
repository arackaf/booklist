import booksPreload, { subjectsAndTagsNonPublicPreload } from "../modules/books/booksPreload";
import subjectsPreload from "../modules/subjects/subjectsPreload";

export function getModulePreloadFunction(moduleToLoad: string): Function {
  switch (moduleToLoad.toLowerCase()) {
    case "books":
    case "view":
      return () => {
        import("../modules/books/books");
        booksPreload();
      };
    case "scan":
      return () => {
        import("../modules/scan/scan");
        subjectsAndTagsNonPublicPreload();
      };

    case "subjects":
      return () => {
        import("../modules/subjects/subjects");
        subjectsPreload();
      };
  }
}
