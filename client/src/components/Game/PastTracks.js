import React, { useEffect } from 'react';
import useLoadedData from '../../requests/loadable';
import { gameMineUrl } from '../../requests/routes';
import { Box, Grid, Typography } from '@material-ui/core';
import Track from '../Track/Track';

const PastTracks = ({ slug, tracks }) => {
  // FIXME: although we don't need loading, we should probably throw something
  // if an error shows up.
  const { data, sync } = useLoadedData(gameMineUrl(slug));

  // Sync my past answers when tracks change (new song)
  useEffect(sync, [tracks, sync]);

  const myAnswers = data || {};
  const lastTrackIndex = tracks.length - 1;
  return (
    <>
      <Box mb={1}>
        <Typography component="h3" variant="h4">
          Past songs
        </Typography>
      </Box>
      <Grid container direction="column" spacing={1}>
        {tracks.map((v, k) => (
          <Grid item key={k}>
            <Track track={v} answer={myAnswers[lastTrackIndex - k]} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default PastTracks;
