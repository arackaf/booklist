import { redirect } from "@sveltejs/kit";
import { ADMIN_USER } from "$env/static/private";

import { differenceInMinutes, differenceInHours, differenceInCalendarDays, differenceInCalendarMonths, differenceInCalendarYears } from "date-fns";

import { clearSync, getBooksWithSimilarBooks } from "$data/similar-books";

export const load = async ({ parent, url }) => {
  const parentParams = await parent();
  if (!parentParams.isAdminUser) {
    throw redirect(302, "/");
  }

  const subjects = url.searchParams.getAll("subjects");
  const myBooks = url.searchParams.get("my-books");

  const books = await getBooksWithSimilarBooks({ userId: myBooks == "true" ? parentParams.userId : undefined, subjects });

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
      book.similarBooksLastSyncDisplay = "just now";
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
    const session = (await locals.getSession()) as any;
    if (session?.userId !== ADMIN_USER) {
      return {};
    }

    const formData: FormData = await request.formData();

    const id = parseInt(formData.get("id")?.toString()!, 10);
    await clearSync(id);

    return { success: true };
  }
};
