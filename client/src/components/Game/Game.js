import React, {
  useReducer,
  useCallback,
  useState,
  useEffect,
  useContext,
} from 'react';

import { Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Preview from './Preview';
import PastTracks from './PastTracks';
import Rankings from './Rankings';
import consumer from '../../channels/consumer';
import GameState from './State';
import {
  dispatcher,
  handleDataReceived,
  startGame,
  stopGame,
} from '../../logic/game';
import { updateSnack } from '../../logic/snack';
import Snackbar from '../Snackbar/Snack';
import PositiveButton from '../Buttons/Positive';
import NegativeButton from '../Buttons/Negative';
import UserContext from '../../contexts/UserContext';
import { usersMatch } from '../../logic/user';

const useStyles = makeStyles((theme) => ({
  botSpace: {
    marginBottom: theme.spacing(2),
  },
}));

const Game = ({ game }) => {
  const [state, changeState] = useReducer(dispatcher, game);
  const [preview, setPreview] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const snackCallback = useCallback((data) => updateSnack(data, setSnack), [
    setSnack,
  ]);

  const { slug, rankings, tracks, started, available } = state;

  const user = useContext(UserContext);
  const canManageGame = user.admin || usersMatch(user, game.createdBy);

  // The subscription
  useEffect(() => {
    if (!slug) return;
    const sub = consumer.subscriptions.create(
      {
        channel: 'GameChannel',
        id: slug,
      },
      {
        received: (data) => handleDataReceived(data, changeState, setPreview),
      }
    );
    return () => {
      if (!slug) return;
      consumer.subscriptions.remove(sub);
    };
  }, [slug, changeState, setPreview]);

  const { botSpace } = useStyles();

  // FIXME: create some "actionsforuser" component
  return (
    <>
      <Snackbar snack={snack} setSnack={setSnack} />
      <Preview preview={preview} />
      <Grid container>
        {canManageGame && !started && available && (
          <Grid item xs={12} className={botSpace}>
            <PositiveButton
              fullWidth
              variant="contained"
              onClick={() => startGame(slug, snackCallback)}
            >
              Start
            </PositiveButton>
          </Grid>
        )}
        {canManageGame && started && available && (
          <Grid item xs={12} className={botSpace}>
            <NegativeButton
              fullWidth
              variant="contained"
              onClick={() => stopGame(slug, snackCallback)}
            >
              Abort game
            </NegativeButton>
          </Grid>
        )}
        <Grid container item xs={12} className={botSpace}>
          <GameState game={game} preview={preview} />
        </Grid>
        <Grid item xs={12} md={6} className={botSpace}>
          <Box mr={{ md: 2 }}>
            <Rankings rankings={rankings} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <PastTracks slug={slug} tracks={tracks} />
        </Grid>
      </Grid>
    </>
  );
};

export default Game;
