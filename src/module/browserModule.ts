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
