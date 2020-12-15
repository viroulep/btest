import React, { useReducer, useState, useEffect, useContext } from 'react';

import { Box, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PastTracks from './PastTracks';
import Rankings from './Rankings';
import consumer from '../../channels/consumer';
import GameState from './State';
import { dispatcher, handleDataReceived } from '../../logic/game';
import { usePostFetch } from '../../hooks/requests';
import { gameStartUrl, gameStopUrl } from '../../requests/routes';
import PositiveButton from '../Buttons/Positive';
import NegativeButton from '../Buttons/Negative';
import UserContext from '../../contexts/UserContext';
import CloneGameButton from './CloneGameButton';
import { usersMatch } from '../../logic/user';

const useStyles = makeStyles((theme) => ({
  botSpace: {
    marginBottom: theme.spacing(2),
  },
}));

const Game = ({ game }) => {
  const [state, changeState] = useReducer(dispatcher, game);
  const [preview, setPreview] = useState(null);
  const { fetcher, openSnack } = usePostFetch();

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

  const startAction = () => fetcher(gameStartUrl(slug), {}).then(openSnack);
  const stopAction = () => fetcher(gameStopUrl(slug), {}).then(openSnack);

  // FIXME: create some "actionsforuser" component
  return (
    <>
      <Grid container>
        {canManageGame && !started && available && (
          <Grid item xs={12} className={botSpace}>
            <PositiveButton fullWidth variant="contained" onClick={startAction}>
              Start
            </PositiveButton>
          </Grid>
        )}
        {canManageGame && started && available && (
          <Grid item xs={12} className={botSpace}>
            <NegativeButton fullWidth variant="contained" onClick={stopAction}>
              Abort game
            </NegativeButton>
          </Grid>
        )}
        {!user.anonymous && !available && (
          <Grid item xs={12} className={botSpace}>
            <CloneGameButton slug={slug} />
          </Grid>
        )}
        <Grid container item xs={12} className={botSpace}>
          <GameState game={state} preview={preview} />
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
