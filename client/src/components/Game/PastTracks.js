import React, { useEffect } from 'react';
import useLoadedData from '../../requests/loadable';
import { gameMineUrl } from '../../requests/routes';
import Marks from '../Answer/Marks';

const PastTracks = ({
  slug,
  tracks,
}) => {
  // FIXME: although we don't need loading, we should probably throw something
  // if an error shows up.
  const {
    data, sync,
  } = useLoadedData(
    gameMineUrl(slug),
  );

  // Sync my past answers when tracks change (new song)
  useEffect(sync, [tracks, sync]);

  const myAnswers = data || {}
  const lastTrackIndex = tracks.length - 1;
  return (
    <>
      <h3>Past songs</h3>
      <ul>
        {tracks.map((v, k) => (
          <li key={k}>
            <img alt="album cover" src={v.cover_url} /><b>{v.title}</b> - <b>{v.artist}</b>
            <br/>
            <Marks data={myAnswers[lastTrackIndex - k]} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default PastTracks;
