export const getCrossOriginAttribute: any = url => {
  if (/https:\/\/my-library-cover-uploads.s3.amazonaws.com/.test(url)) {
    return {};
  }

  return { crossOrigin: "anonymous" };
};
