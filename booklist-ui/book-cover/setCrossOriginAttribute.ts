export const setCrossOriginAttribute: any = (img: HTMLImageElement, url: string) => {
  if (/cloudfront\.net/.test(url)) {
    img.crossOrigin = "anonymous";
  }
};
