import React from "react";

export const imgCache = {
  __cache: {},
  preload(src, cors = false) {
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

    return this.__cache[src];
  },
  getImg(src, cors = false) {
    const result = this.preload(src, cors);
    if (result instanceof Promise) {
      throw result;
    }
    return result;
  },
  clearImg: src => {
    delete this.__cache;
  }
};

export const SuspenseImg = ({ src, crossOrigin = null, ...rest }) => {
  const attrs = imgCache.getImg(src, crossOrigin == "anonymous") as any;

  return <img crossOrigin={crossOrigin} src={src} {...{ ...attrs, ...rest }} />;
};
