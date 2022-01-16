import corsResponse, { rawResponse } from "../util/corsResponse";

export const login = async event => {
  const { isbn } = JSON.parse(event.body);

  //return corsResponse({ a: 12, multiValueHeaders: { "Set-Cookie": [`language=english; maxAge=900000`, `theme=red`] } });
  return rawResponse({
    a: 12,
    headers: {
      "access-control-expose-headers": "set-cookie",
      "Set-Cookie": `abc=def; maxAge=900000; path=/; SameSite=None; Secure; HttpOnly`,
      "Access-Control-Allow-Origin": "http://localhost:3002"
    }
    // multiValueHeaders: { "Set-Cookie": [`language=english;SameSite=None;Secure`, `theme=red;SameSite=None;Secure`] }
  });
};
