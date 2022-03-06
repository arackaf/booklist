import booksPreload, { subjectsAndTagsNonPublicPreload } from "../modules/books/booksPreload";
import subjectsPreload from "../modules/subjects/subjectsPreload";

export function getModulePreloadFunction(moduleToLoad: string): Function {
  switch (moduleToLoad.toLowerCase()) {
    case "books":
    case "view":
      return () => {
        booksPreload();
        import("../modules/books/books");
      };
    case "scan":
      return () => {
        subjectsAndTagsNonPublicPreload();
        import("../modules/scan/scan");
      };

    case "subjects":
      return () => {
        subjectsPreload();
        import("../modules/subjects/subjects");
      };
  }
}
