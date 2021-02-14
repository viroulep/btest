import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
} from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  errorIcon: {
    color: orange[500],
  },
  centered: {
    margin: 'auto',
  },
}));

const PlaylistAnalysisDialog = ({ playlist }) => {
  const [open, setOpen] = useState(false);
  const { centered, errorIcon } = useStyles();
  const { unreadable_tracks, nb_tracks } = playlist;
  return (
    <>
      <IconButton onClick={() => setOpen(!open)} className={centered}>
        <ErrorIcon className={errorIcon} />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Warning for playlist "{playlist.title}"</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Some tracks in your playlist are available only through the official
            Deezer application, which mean they won't be able to be played in
            this musical quizz, and will be ignored when selecting tracks.
            <br />
            There is unfortunately nothing we can do.
            <br />
            Here are all the tracks which can't be read (
            {unreadable_tracks.length} out of {nb_tracks}):
            <ul>
              {unreadable_tracks.map(({ id, title }) => (
                <li key={id}>{title}</li>
              ))}
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            color="secondary"
            variant="contained"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlaylistAnalysisDialog;
