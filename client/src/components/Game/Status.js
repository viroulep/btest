import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  mt: {
    marginTop: theme.spacing(1),
  },
}));

const statusForGame = (game) => {
  const { finished, aborted, started } = game;
  if (finished) {
    return 'This game is finished.';
  } else if (aborted) {
    return 'This game was aborted.';
  } else if (started) {
    return 'The game is currently ongoing. Stop reading this and start typing!';
  } else {
    return "The game has been created, but we're waiting for its creator to start it.";
  }
};

const ShowDeezerMix = ({ data }) => (
  <Typography>
    The tracklist was generated using the Deezer mix "{data.title}".
  </Typography>
);

const ShowDeezerPlaylists = ({ data }) => (
  <Typography component="div">
    The tracklist was generated using the following Deezer playlists:
    <List>
      {data.playlists.map(({ id, title, description }) => (
        <ListItem key={id}>
          {title}
          {description.length > 0 && <> - {description}</>}
        </ListItem>
      ))}
    </List>
  </Typography>
);

const typeToComponent = {
  DeezerMix: ShowDeezerMix,
  DeezerPlaylist: ShowDeezerPlaylists,
};

const GameStatus = ({ game }) => {
  const classes = useStyles();
  const { source } = game;
  const ShowSource = typeToComponent[source ? source.type : null];
  return (
    <Alert severity="info" className={classes.mt}>
      <Typography>{statusForGame(game)}</Typography>
      {ShowSource && <ShowSource data={source.data} />}
      <Typography>
        Answers were validated using the {game.validator} algorithm.
      </Typography>
    </Alert>
  );
};

export default GameStatus;
