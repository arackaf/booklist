import { getCrossOriginAttribute } from "./corsHelpers";

const imgCache = {
  __cache: {},
  getImg(src, { cors = false, timeout = 2000 } = {}) {
    if (!src) {
      return;
    }
    if (!this.__cache[src]) {
      this.__cache[src] = new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          this.__cache[src] = { height: img.height, width: img.width };
          resolve(this.__cache[src]);
        };
        if (cors) {
          img.crossOrigin = "anonymous";
        }
        img.src = src;
        setTimeout(() => resolve({}), timeout);
      }).then(img => {
        this.__cache[src] = img;
      });
    }

    if (this.__cache[src] instanceof Promise) {
      return this.__cache[src];
    }
    return this.__cache[src];
  },
  clearImg(src) {
    delete this.__cache;
  }
};

const preloadImages = (images, options = {} as { timeout?: number }) => {
  let allPending = images
    .filter(val => val)
    .map(img => {
      let attrs = getCrossOriginAttribute(img);
      return imgCache.getImg(img, { cors: attrs.crossorigin == "anonymous", timeout: options.timeout });
    });
  let promises = allPending.filter(entry => entry.then);
  return (promises.length ? Promise.all(promises).then(() => {}) : Promise.resolve()) as any;
};

export const preloadRecommendationImages = resp => {
  let images = resp?.results?.map(book => book.smallImage) ?? [];
  return preloadImages(images);
};

export const preloadBookImages = resp => {
  let smallImages = resp?.data?.allBooks?.Books?.map(book => book.smallImage) ?? [];
  let mediumImages = resp?.data?.allBooks?.Books?.map(book => book.mediumImage) ?? [];
  return preloadImages([...smallImages, ...mediumImages]);
};

export const preloadNewBookImage = book => {
  return preloadImages([book.smallImage], { timeout: 750 });
};
