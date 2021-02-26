const ACCESS_TOKEN = 'Access-Token';

export const getAccessToken = (): string => {
  return localStorage.getItem(ACCESS_TOKEN) || '';
};

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
};
