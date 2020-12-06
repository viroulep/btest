import React, { useState, useContext, useCallback } from 'react';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { fetchJsonOrError } from '../../requests/fetchJsonOrError';
import { getPlaylistIdFromUrl } from '../../logic/game';
import { getDeezerPlaylistUrl } from '../../requests/routes';
import SnackContext from '../../contexts/SnackContext';

const useStyles = makeStyles(() => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
}));

const AddPlaylistCard = ({ playlists, setPlaylists }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const openSnack = useContext(SnackContext);
  const classes = useStyles();
  const addPlaylist = useCallback(
    (input) => {
      const playlistId = getPlaylistIdFromUrl(input);
      if (!playlistId) {
        setTimeout(
          () =>
            openSnack({
              message:
                'The url seems to be invalid, make sure to respect the expected format.',
            }),
          0
        );
      } else if (playlists[playlistId] !== undefined) {
        setTimeout(
          () => openSnack({ message: 'The playlist is already added.' }),
          0
        );
      } else {
        setLoading(true);
        fetchJsonOrError(getDeezerPlaylistUrl(playlistId))
          .then((data) => {
            setPlaylists((old) => {
              const newPlaylists = {
                ...old,
              };
              newPlaylists[data['id']] = {
                id: data['id'],
                title: data['title'],
                description: data['description'],
                nb_tracks: data['nb_tracks'],
                picture: data['picture'],
                selected: true,
              };
              return newPlaylists;
            });
          })
          .finally(() => {
            setUrl('');
            setLoading(false);
          });
      }
    },
    [setLoading, setUrl, playlists, setPlaylists, openSnack]
  );
  return (
    <Card className={classes.card} variant="outlined">
      <CardContent className={classes.cardContent}>
        <Box mb={2}>
          <Typography variant="h6" component="h4">
            Add a playlist
          </Typography>
        </Box>
        <TextField
          label="Playlist url"
          fullWidth
          value={url}
          placeholder="https://www.deezer.com/playlist/908622995"
          onChange={(ev) => setUrl(ev.target.value)}
          helperText="Go to your (public!) playlist page on deezer, and copy its url in this field. It should roughly looks like https://www.deezer.com/playlist/908622995."
        />
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() => addPlaylist(url)}
          disabled={loading}
        >
          Add and select it
        </Button>
      </CardActions>
    </Card>
  );
};

export default AddPlaylistCard;
