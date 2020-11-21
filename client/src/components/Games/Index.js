import React, { useCallback }  from 'react';
import WithLoading from '../WithLoading/WithLoading';
import useLoadedData from '../../requests/loadable';
import { Card, CardHeader, CardContent, Container, List, ListItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PositiveButton from '../Buttons/Positive';
import { fetchJsonOrError } from '../../requests/fetchJsonOrError';
import { Link as RouterLink } from 'react-router-dom';
import { gamesUrl } from '../../requests/routes';

const statusForGame = game => {
  if (game.finished) {
    return "finished";
  } else if (game.aborted) {
    return "aborted";
  } else if (game.running) {
    return "running";
  } else if (game.available) {
    return "will start";
  } else {
    return "unknown";
  }
};

const GamesList = ({
  games,
}) => (
  <List>
    {games.map((v, k) => (
      <ListItem button component={RouterLink} key={k} to={`/games/${v.slug}`}>
        Game #{v.slug} ({statusForGame(v)})
      </ListItem>
    ))}
    <ListItem button>
    </ListItem>
  </List>
);


const GamesIndex = ({
  setMsg,
  me,
}) => {
  const loadedData = useLoadedData(gamesUrl());
  const { data, sync } = loadedData;

  const createGame = useCallback(() => {
    fetchJsonOrError(gamesUrl(), { method: 'POST' })
      .then((data) => {
        setMsg(`Success: ${data.success ? "yes" : "no"}, msg: ${data.message}`);
        sync();
      });
  }, [setMsg, sync]);

  return (
    <Container>
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
