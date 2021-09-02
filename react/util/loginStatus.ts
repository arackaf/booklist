export function isLoggedIn() {
  let logged_in = getCookie("logged_in");
  let userId = getCookie("userId");
  let loginToken = getCookie("loginToken");
  return { logged_in, userId, loginToken };
}

export function isAdmin() {
  let admin = getCookie("admin");
  return !!admin;
}

export function isJrAdmin() {
  let admin = getCookie("jr_admin");
  return !!admin;
}

type CookieState = {
  email: string;
  userId: string;
  loginToken: string;
  remember_me: string;
  logged_in: string;
};

export function getCookieLookup(): Partial<CookieState> {
  return document.cookie.split("; ").reduce((lookup, v) => {
    const parts = v.split("=");
    lookup[parts[0]] = parts[1];

    return lookup;
  }, {});
}

export const getLoginStatus = () => {
  const hash = getCookieLookup();
  return { userId: hash.userId, loginToken: hash.loginToken };
};

function getCookie(name) {
  for (let piece of document.cookie.split("; ")) {
    const parts = piece.split("=");
    if (parts[0] === name) {
      return decodeURIComponent(parts[1]);
    }
  }
}
