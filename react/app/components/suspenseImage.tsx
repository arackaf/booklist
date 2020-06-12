import React from "react";

const imgCache = {
  __cache: {},
  getImg(src, cors = false) {
    if (!src) {
      return;
    }
    if (!this.__cache[src]) {
      this.__cache[src] = new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          this.__cache[src] = img.height;
          resolve(img.height);
        };
        if (cors) {
          img.crossOrigin = "anonymous";
        }
        img.src = src;
        setTimeout(() => resolve(-1), 2000);
      }).then(img => {
        this.__cache[src] = img;
      });
    }

    if (this.__cache[src] instanceof Promise) {
      throw this.__cache[src];
    }
    return this.__cache[src];
  },
  clearImg: src => {
    delete this.__cache;
  }
};

export const SuspenseImg = ({ src, crossOrigin, ...rest }) => {
  const height = imgCache.getImg(src, crossOrigin == "anonymous") as any;

  return <img crossOrigin="anonymous" src={src} height={height > 0 ? height : null} {...{ crossOrigin, ...rest }} />;
};
