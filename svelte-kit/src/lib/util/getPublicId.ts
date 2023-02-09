export const getPublicId = (request: any): string => {
  // do NOT use the url arg that comes with the loader, since we don't want this to re-run whenever the url changes
  const requestUrl = new URL(request.url);
  return requestUrl.searchParams.get("user") || "";
};
