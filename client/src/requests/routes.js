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
export const mixesUrl = () => `${BASE_URL}/sources/deezer_mixes`;
export const pastGamesUrl = () => `${gamesUrl()}?scope=past`;
export const availableGamesUrl = () => `${gamesUrl()}?scope=available`;
export const adminGamesUrl = () => `${gamesUrl()}?scope=admin`;
export const gameUrl = (id) => `${gamesUrl()}/${id}`;
export const gameAttemptUrl = (id) => `${gameUrl(id)}/attempt`;
export const gameMyAnswersUrl = (id) => `${gameUrl(id)}/my_answers`;
export const gameStartUrl = (id) => `${gameUrl(id)}/start`;
export const gameCloneUrl = (id) => `${gameUrl(id)}/clone`;
export const gameStopUrl = (id) => `${gameUrl(id)}/abort`;
export const cableUrl = () => `${BASE_URL}/cable`;
export const getDeezerPlaylistUrl = (id) =>
  `${BASE_URL}/deezer_playlists/import/${id}`;
export const usersUrl = () => `${BASE_URL}/users`;
export const userUrl = (id) => `${usersUrl()}/${id}`;
