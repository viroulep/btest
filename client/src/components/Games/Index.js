import React, { useState, useCallback, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import useLoadedData from '../../requests/loadable';
import UserContext from '../../contexts/UserContext';
import PositiveButton from '../Buttons/Positive';
import { fetchJsonOrError } from '../../requests/fetchJsonOrError';
import WithLoading from '../WithLoading/WithLoading';
import { gamesUrl } from '../../requests/routes';
import Snackbar from '../Snackbar/Snack';
import { updateSnack } from '../../logic/snack';
import { statusForGame } from '../../logic/game';

const GamesList = ({ games }) => (
  <List>
    {games.map((v, k) => (
      <ListItem button component={RouterLink} key={k} to={`/games/${v.slug}`}>
        Game "{v.slug}" ({statusForGame(v)})
      </ListItem>
    ))}
  </List>
);

const GamesIndex = () => {
  const loadedData = useLoadedData(gamesUrl());
  const { data, sync } = loadedData;
  const [snack, setSnack] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const createGame = useCallback(() => {
    fetchJsonOrError(gamesUrl(), { method: 'POST' }).then((data) => {
      updateSnack(data, setSnack);
      sync();
    });
  }, [setSnack, sync]);

  const { anonymous } = useContext(UserContext);
  const headerAction = anonymous ? (
    ''
  ) : (
    <PositiveButton
      variant="contained"
      onClick={createGame}
      startIcon={<AddIcon />}
    >
      Create
    </PositiveButton>
  );

  return (
    <>
      <Snackbar snack={snack} setSnack={setSnack} />
      <Card>
        <CardHeader title="Games" action={headerAction} />
        <CardContent>
          <WithLoading
            Component={GamesList}
            loadedData={loadedData}
            games={data}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default GamesIndex;
