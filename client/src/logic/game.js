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

const getPlaylistIdFromUrl = (input) => {
  try {
    const parsedURL = new URL(input);
    const parts = parsedURL.pathname.split('/');
    // Deezer may include a locale in the url
    while (parts.length > 2) {
      parts.shift();
    }
    const endpoint = parts[0];
    const playlistId = parseInt(parts[1]);
    if (endpoint !== 'playlist' || Object.is(playlistId, NaN)) {
      return undefined;
    }
    return playlistId;
  } catch (error) {
    return undefined;
  }
};

const copyUrlToClipboard = async (openSnack) => {
  if (!navigator.clipboard) {
    return;
  }
  try {
    await navigator.clipboard.writeText(window.location.href);
    openSnack({ success: true, message: 'URL copied to clipboard!' });
  } catch (err) {
    openSnack(err);
  }
};

export {
  dispatcher,
  currentAnswer,
  handleDataReceived,
  statusForGame,
  getPlaylistIdFromUrl,
  copyUrlToClipboard,
};
