import React, { useState, useCallback }  from 'react';
import WithLoading from '../WithLoading/WithLoading';
import useLoadedData from '../../requests/loadable';
import { Card, CardHeader, CardContent, Container, List, ListItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PositiveButton from '../Buttons/Positive';
import { fetchJsonOrError } from '../../requests/fetchJsonOrError';
import { Link as RouterLink } from 'react-router-dom';
import { gamesUrl } from '../../requests/routes';
import Snackbar from '../Snackbar/Snack';
import { updateSnack } from '../../logic/snack';
import { statusForGame } from '../../logic/game';

const GamesList = ({
  games,
}) => (
  <List>
    {games.map((v, k) => (
      <ListItem button component={RouterLink} key={k} to={`/games/${v.slug}`}>
        Game "{v.slug}" ({statusForGame(v)})
      </ListItem>
    ))}
  </List>
);


const GamesIndex = ({
  me,
}) => {
  const loadedData = useLoadedData(gamesUrl());
  const { data, sync } = loadedData;
  const [snack, setSnack] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const createGame = useCallback(() => {
    fetchJsonOrError(gamesUrl(), { method: 'POST' })
      .then((data) => {
        updateSnack(data, setSnack);
        sync();
      });
  }, [setSnack, sync]);

  return (
    <Container>
      <Snackbar snack={snack} setSnack={setSnack} />
      <Card>
        <CardHeader
          title="Games"
          action={
            <PositiveButton
              variant="contained"
              onClick={createGame}
              startIcon={<AddIcon />}
            >
              Create
            </PositiveButton>
          }
        />
        <CardContent>
          <WithLoading Component={GamesList} loadedData={loadedData} games={data} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default GamesIndex;
