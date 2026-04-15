export const setCookie = (name: string, value: string): void => {
  document.cookie = `${name}=${value};path=/`;
};

export const getCookie = (name: string): string | null => {
  const cookieArr = document.cookie.split(';');

  for (const cookie of cookieArr) {
    const [key, value] = cookie.split('=');

    if (name === key.trim()) {
      return decodeURIComponent(value);
    }
  }

  return null;
};

export const eraseCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const setSessionStorage = (name: string, value: string): void => {
  sessionStorage.setItem(name, value);
};

export const getSessionStorage = (name: string): string | null => {
  return sessionStorage.getItem(name);
};

export const eraseSessionStorage = (name: string): void => {
  sessionStorage.removeItem(name);
};

export const setToken = (name: string, value: string): void => {
  setCookie(name, value);
  setSessionStorage(name, value);
};

export const getToken = (name: string): string | null => {
  return getCookie(name) ?? getSessionStorage(name);
};

export const eraseToken = (name: string): void => {
  eraseCookie(name);
  eraseSessionStorage(name);
};
