import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@material-ui/core';

import Game from '../Game/Game';

const InteractionWrapper = ({ hasInteracted, game, ...props }) => {
  const [open, setOpen] = useState(!hasInteracted);
  return (
    <>
      {hasInteracted || !game.available ? (
        <Game game={game} {...props} />
      ) : (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Joining a game</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You're about to join a music quizz game.
              <br />
              You have not interacted with the page yet, and modern browsers
              will block any autoplayed content in such cases.
              <br />
              Simply close this dialog or click anywhere to actually join and
              enjoy the game!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpen(false)}
              color="primary"
              variant="contained"
            >
              Join the game
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default InteractionWrapper;
