import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';

import Marks from '../Answer/Marks';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  cover: {
    minWidth: 120,
  },
}));

export default function MediaControlCard({ track, answer }) {
  const { root, details, cover } = useStyles();
  const { cover_url, title, artist } = track;
  return (
    <Card className={root}>
      <CardMedia className={cover} image={cover_url} title="album cover" />
      <CardContent className={details}>
        <Typography component="h5" variant="h5">
          {title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {artist}
        </Typography>
        <Marks data={answer} />
      </CardContent>
    </Card>
  );
}
