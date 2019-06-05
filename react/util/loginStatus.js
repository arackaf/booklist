export function isLoggedIn() {
  let logged_in = getCookie("logged_in");
  let userId = getCookie("userId");
  return { logged_in, userId };
}

export function isAdmin() {
  let admin = getCookie("admin");
  return !!admin;
}

export function isJrAdmin() {
  let admin = getCookie("jr_admin");
  return !!admin;
}

function getCookie(name) {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
}
