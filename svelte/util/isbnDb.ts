export const getIsbnDbBookCover = isbn => {
  return fetch(`${process.env.ISBN_DB_COVER}/`, {
    method: "post",
    mode: "cors",
    body: JSON.stringify({ isbn })
  }).then(resp => resp.json());
};
