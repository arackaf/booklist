export const getCrossOriginAttribute: any = url => {
  if (/cloudfront\.net/.test(url)) {
    return { crossOrigin: "anonymous" };
  }
  return {};
};
