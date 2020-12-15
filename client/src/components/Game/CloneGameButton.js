import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from '@material-ui/core';

import { gameCloneUrl } from '../../requests/routes';
import { usePostFetch } from '../../hooks/requests';

const CloneGameButton = ({ slug }) => {
  const history = useHistory();
  const { fetcher, openSnack } = usePostFetch();
  const [loading, setLoading] = useState(false);
  const cloneGame = useCallback(() => {
    setLoading(true);
    fetcher(gameCloneUrl(slug), {})
      .then((data) => {
        const { success, message, newGameSlug } = data;
        if (success) {
          // Nagivate to the list of available games
          history.push(`/games/${newGameSlug}`);
        } else {
          openSnack({ message });
        }
      })
      .finally(() => setLoading(false));
  }, [slug, history, openSnack, fetcher]);

  return (
    <Button
      fullWidth
      disabled={loading}
      variant="contained"
      color="secondary"
      onClick={() => cloneGame(slug, openSnack)}
    >
      Create a new game based on this game's settings.
    </Button>
  );
};

export default CloneGameButton;
