import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Box, Paper, Typography, Button } from '@material-ui/core';

import { fetchJsonOrError } from '../../requests/fetchJsonOrError';
import { gamesUrl } from '../../requests/routes';

const NewGame = () => {
  // TODO: handle error... (with application-wide snackbar!)

  const history = useHistory();
  const createGameAction = useCallback(
    () =>
      fetchJsonOrError(gamesUrl(), { method: 'POST' }).then((data) => {
        // Nagivate to the list of available games
        history.push('/games');
      }),
    [history]
  );
  return (
    <Paper>
      <Box p={2}>
        <Typography component="h3">Create a game</Typography>
        <Button variant="contained" color="primary" onClick={createGameAction}>
          Create
        </Button>
      </Box>
    </Paper>
  );
};

export default NewGame;
