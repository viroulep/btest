import React, { useCallback, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Box,
  FormControlLabel,
  Grid,
  Input,
  Select,
  MenuItem,
  Paper,
  Typography,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';

import WithLoading from '../WithLoading/WithLoading';
import useLoadedData from '../../requests/loadable';
import { fetchJsonOrError } from '../../requests/fetchJsonOrError';
import { gamesUrl, mixesUrl } from '../../requests/routes';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  ml: {
    marginLeft: theme.spacing(2),
  },
}));

const NewGameForm = ({ mixes }) => {
  // FIXME: really need error handling here...
  const history = useHistory();
  const [length, setLength] = useState(15);
  const lengthRef = useRef(null);
  const [mix, setMix] = useState('');
  const mixRef = useRef(null);
  const createGameAction = useCallback(() => {
    fetchJsonOrError(gamesUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        length: lengthRef.current.value,
        source: {
          type: 'deezer_mix',
          id: mixRef.current.value,
        },
      }),
    })
      .then((data) => {
        // Nagivate to the list of available games
        history.push(`/games/${data.newGameSlug}`);
      })
      .catch((error) => alert(`Something went wrong: ${error}`));
  }, [history]);

  const { ml } = useStyles();
  return (
    <>
      <Grid item>
        <FormControlLabel
          control={
            <Input
              type="number"
              className={ml}
              inputProps={{
                ref: lengthRef,
              }}
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          }
          label="Number of tracks"
          labelPlacement="start"
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={
            <Select
              className={ml}
              inputProps={{
                ref: mixRef,
              }}
              value={mix}
              onChange={(e) => setMix(e.target.value)}
            >
              {mixes.map((mix) => (
                <MenuItem key={mix.id} value={mix.id}>
                  {mix.title}
                </MenuItem>
              ))}
            </Select>
          }
          label="Deezer mix"
          labelPlacement="start"
        />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={createGameAction}>
          Create
        </Button>
      </Grid>
    </>
  );
};

const NewGame = () => {
  const loadedData = useLoadedData(mixesUrl());
  const { data } = loadedData;

  return (
    <Paper>
      <Box p={2}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h4">Create a game</Typography>
            <Alert severity="info">
              The number of tracks must be between 5 and 50, and you must select
              a mix to take the tracks from.
            </Alert>
          </Grid>
          <WithLoading
            Component={NewGameForm}
            mixes={data}
            loadedData={loadedData}
          />
        </Grid>
      </Box>
    </Paper>
  );
};

export default NewGame;
