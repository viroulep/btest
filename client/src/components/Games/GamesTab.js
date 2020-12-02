import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { List, ListItem } from '@material-ui/core';

import { statusForGame } from '../../logic/game';
import useLoadedData from '../../requests/loadable';
import WithLoading from '../WithLoading/WithLoading';

const GamesList = ({ games }) => (
  <List>
    {games.length === 0 && <ListItem>No games found.</ListItem>}
    {games.map((v, k) => (
      <ListItem button component={RouterLink} key={k} to={`/games/${v.slug}`}>
        Game "{v.slug}" ({statusForGame(v)})
      </ListItem>
    ))}
  </List>
);

const GamesTab = ({ url, index }) => {
  const loadedData = useLoadedData(url());
  const { data } = loadedData;
  return (
    <WithLoading Component={GamesList} loadedData={loadedData} games={data} />
  );
};

const HideTabProxy = ({ url, active, index }) =>
  active === index ? <GamesTab url={url} index={index} /> : <></>;

export default HideTabProxy;
