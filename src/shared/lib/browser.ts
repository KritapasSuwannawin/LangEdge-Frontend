export const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value};path=/`;
};

export const getCookie = (name: string) => {
  const cookieArr = document.cookie.split(';');

  for (const cookie of cookieArr) {
    const [key, value] = cookie.split('=');

    if (name === key.trim()) {
      return decodeURIComponent(value);
    }
  }

  return null;
};

export const eraseCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const setSessionStorage = (name: string, value: string) => {
  sessionStorage.setItem(name, value);
};

export const getSessionStorage = (name: string) => {
  return sessionStorage.getItem(name);
};

export const eraseSessionStorage = (name: string) => {
  sessionStorage.removeItem(name);
};

export const setToken = (name: string, value: string) => {
  setCookie(name, value);
  setSessionStorage(name, value);
};

export const getToken = (name: string) => {
  return getCookie(name) ?? getSessionStorage(name);
};

export const eraseToken = (name: string) => {
  eraseCookie(name);
  eraseSessionStorage(name);
};
