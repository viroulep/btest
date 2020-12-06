import React from 'react';

import { Grid } from '@material-ui/core';

import CardForObject from './CardForObject';
import AddPlaylistCard from './AddPlaylistCard';

const toggleSelectedPlaylist = (setPlaylists, id) =>
  setPlaylists((oldPlaylists) => {
    const newPlaylists = {
      ...oldPlaylists,
    };
    // Update our entry
    newPlaylists[id].selected = !oldPlaylists[id].selected;
    return newPlaylists;
  });

const PlaylistsInput = ({ playlists, setPlaylists }) => (
  <Grid container spacing={2}>
    {Object.values(playlists).map((playlist) => (
      <Grid item key={playlist.id}>
        <CardForObject
          action={() => toggleSelectedPlaylist(setPlaylists, playlist.id)}
          selected={playlist.selected}
          object={playlist}
        />
      </Grid>
    ))}
    <Grid item xs={12} md={6} lg={4}>
      <AddPlaylistCard playlists={playlists} setPlaylists={setPlaylists} />
    </Grid>
  </Grid>
);

export default PlaylistsInput;
