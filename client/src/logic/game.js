import { gameStartUrl, gameStopUrl } from '../requests/routes';
import { fetchJsonOrError } from '../requests/fetchJsonOrError';

const dispatcher = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case 'rankings':
      return {
        ...state,
        rankings: data,
      };
    case 'state':
      return data;
    default:
      throw new Error();
  }
};

const currentAnswer = (rankings, me) => {
  const myRank = rankings.find(
    (el) => el.id === me.id && el.anonymous === me.anonymous
  );
  return myRank ? myRank.current : null;
};

const stopGame = (slug, setMsg) => {
  fetchJsonOrError(gameStopUrl(slug), { method: 'POST' }).then(setMsg);
};

const startGame = (slug, setMsg) => {
  fetchJsonOrError(gameStartUrl(slug), { method: 'POST' }).then(setMsg);
};

const handleDataReceived = (data, changeState, setPreview) => {
  const { rankings, state, preview } = data;
  if (rankings) {
    changeState({
      type: 'rankings',
      data: rankings,
    });
  }
  if (state) {
    // If we receive a full state it's a sync from the server.
    changeState({
      type: 'state',
      data: state,
    });
    if (preview) {
      setPreview(preview);
    }
  }
};

const statusForGame = (game) => {
  if (game.finished) {
    return 'finished';
  } else if (game.aborted) {
    return 'aborted';
  } else if (game.running) {
    return 'running';
  } else if (game.available) {
    return 'pending';
  } else {
    return 'unknown';
  }
};

export {
  dispatcher,
  currentAnswer,
  startGame,
  stopGame,
  handleDataReceived,
  statusForGame,
};
