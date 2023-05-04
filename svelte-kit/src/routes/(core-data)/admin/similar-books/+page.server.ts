import { redirect } from "@sveltejs/kit";
import { ADMIN_USER, SYNC_BOOK_RECOMMENDATIONS_LAMBDA } from "$env/static/private";

import { differenceInMinutes, differenceInHours, differenceInCalendarDays, differenceInCalendarMonths, differenceInCalendarYears } from "date-fns";

import { getBooksWithSimilarBooks } from "$data/similar-books";
import { invokeLambda } from "$lib/lambda-utils.js";

export const load = async ({ parent }) => {
  const parentParams = await parent();
  if (!parentParams.isAdminUser) {
    throw redirect(302, "/");
  }
  const books = await getBooksWithSimilarBooks();

  const now = new Date(new Date().toISOString());
  books.forEach(book => {
    if (!book.similarBooksLastSync) {
      book.similarBooksLastSyncDisplay = "";
      return;
    }
    const lastSync = new Date(book.similarBooksLastSync);
    const months = differenceInCalendarMonths(now, lastSync);
    const years = differenceInCalendarYears(now, lastSync);
    const days = differenceInCalendarDays(now, lastSync);
    const hours = differenceInHours(now, lastSync);
    const minutes = differenceInMinutes(now, lastSync);

    if (minutes < 5) {
      book.similarBooksLastSyncDisplay = "Just now";
    } else if (hours < 1) {
      book.similarBooksLastSyncDisplay = `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (days < 1) {
      book.similarBooksLastSyncDisplay = `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (days < 32) {
      book.similarBooksLastSyncDisplay = `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (years < 1) {
      book.similarBooksLastSyncDisplay = `${months} month${months === 1 ? "" : "s"} ago`;
    } else {
      book.similarBooksLastSyncDisplay = `${years} years ago`;
    }
  });

  return { books };
};

export const actions = {
  async updateRecommended({ request, locals }) {
    const session = await locals.getSession();
    if (session?.userId !== ADMIN_USER) {
      return {};
    }

    const formData: FormData = await request.formData();

    const id = parseInt(formData.get("id")?.toString()!, 10);
    console.log({ id });

    const result = await invokeLambda(SYNC_BOOK_RECOMMENDATIONS_LAMBDA, { id });

    console.log({ result });

    return { success: true };
  }
};
