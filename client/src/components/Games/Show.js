import React from 'react';
import { useParams } from 'react-router-dom';

import Game from '../Game/Game';
import WithLoading from '../WithLoading/WithLoading';
import useLoadedData from '../../requests/loadable';
import { gameUrl } from '../../requests/routes';

const GameShow = (props) => {
  const { gameId } = useParams();
  const loadedData = useLoadedData(gameUrl(gameId));
  const { data } = loadedData;
  return (
    <WithLoading
      Component={Game}
      game={data}
      loadedData={loadedData}
      {...props}
    />
  );
};

export default GameShow;
