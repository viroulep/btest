import React, { useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from '@material-ui/core';

import { gameCloneUrl } from '../../requests/routes';
import { fetchJsonOrError } from '../../requests/fetchJsonOrError';
import SnackContext from '../../contexts/SnackContext';

const CloneGameButton = ({ slug }) => {
  const openSnack = useContext(SnackContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const cloneGame = useCallback(() => {
    setLoading(true);
    fetchJsonOrError(gameCloneUrl(slug), { method: 'POST' })
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
  }, [slug, history, openSnack]);

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
