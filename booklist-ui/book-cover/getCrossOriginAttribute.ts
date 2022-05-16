export const getCrossOriginAttribute: any = (img: HTMLImageElement, url: string) => {
  if (/cloudfront\.net/.test(url)) {
    img.crossOrigin = "anonymous";
  }
};
