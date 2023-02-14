export const parseUserAgent = (request: any) => {
  const userAgent = request.headers.get("User-Agent");
  return {
    isMobile: /mobile/i.test(userAgent)
  };
};
