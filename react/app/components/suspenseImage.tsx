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
          this.__cache[src] = { height: img.height, width: img.width };
          resolve(this.__cache[src]);
        };
        if (cors) {
          img.crossOrigin = "anonymous";
        }
        img.src = src;
        setTimeout(() => resolve({}), 2000);
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
  const attrs = imgCache.getImg(src, crossOrigin == "anonymous") as any;

  return <img crossOrigin="anonymous" src={src} {...{ ...attrs, crossOrigin, ...rest }} />;
};
