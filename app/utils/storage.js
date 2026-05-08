const AUTH_STORAGE_KEY = "auth";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8;

const parseCookieValue = (name) => {
  if (typeof document === "undefined") {
    return null;
  }

  const key = `${name}=`;
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(key))
    ?.slice(key.length);

  return value || null;
};

const setCookie = (name, value) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
};

const removeCookie = (name) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
};

export const setAuth = (token, role, userId, email) => {
  const payload = {
    token,
    role,
    userId,
    email: email || "",
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  }

  setCookie("token", token);
  setCookie("role", role);
  setCookie("userId", String(userId));
};

export const getAuth = () => {
  if (typeof window !== "undefined") {
    const localValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (localValue) {
      try {
        return JSON.parse(localValue);
      } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }

  const token = parseCookieValue("token");
  const role = parseCookieValue("role");
  const userId = parseCookieValue("userId");

  if (!token || !role || !userId) {
    return null;
  }

  return {
    token: decodeURIComponent(token),
    role: decodeURIComponent(role),
    userId: Number(decodeURIComponent(userId)),
    email: "",
  };
};

export const clearAuth = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  removeCookie("token");
  removeCookie("role");
  removeCookie("userId");
};

export const getToken = () => {
  return getAuth()?.token || null;
};
