const BASE_URL = process.env.REACT_APP_SERVER_URL;

const signInUrl = (provider) => `${BASE_URL}/auth/${provider}`;

const allSignInProviders = [
  {
    id: 'google_oauth2',
    name: 'Google',
    url: signInUrl('google_oauth2'),
  },
  {
    id: 'developer',
    name: 'Developer',
    url: signInUrl('developer'),
  },
];

export const signInProviders = allSignInProviders.filter(
  (p) => p.id !== 'developer' || process.env.NODE_ENV !== 'production'
);

export const meUrl = () => `${BASE_URL}/me`;
export const updateMeUrl = () => `${BASE_URL}/updateMe`;
export const signoutUrl = () => `${BASE_URL}/signout`;
export const gamesUrl = () => `${BASE_URL}/games`;
export const gameUrl = (id) => `${gamesUrl()}/${id}`;
export const gameAttemptUrl = (id) => `${gameUrl(id)}/attempt`;
export const gameMineUrl = (id) => `${gameUrl(id)}/mine`;
export const gameStartUrl = (id) => `${gameUrl(id)}/start`;
export const gameStopUrl = (id) => `${gameUrl(id)}/abort`;
export const cableUrl = () => `${BASE_URL}/cable`;
