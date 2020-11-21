const BASE_URL = process.env.REACT_APP_SERVER_URL;

export const meUrl = () => `${BASE_URL}/me`;
export const gamesUrl = () => `${BASE_URL}/games`;
export const gameUrl = (id) => `${gamesUrl()}/${id}`;
export const gameAttemptUrl = (id) => `${gameUrl(id)}/attempt`;
export const gameMineUrl = (id) => `${gameUrl(id)}/mine`;
export const gameStartUrl = (id) => `${gameUrl(id)}/start`;
export const gameStopUrl = (id) => `${gameUrl(id)}/abort`;
