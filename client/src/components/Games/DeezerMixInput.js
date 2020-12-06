import React from 'react';

import { Grid } from '@material-ui/core';

import useLoadedData from '../../requests/loadable';
import { mixesUrl } from '../../requests/routes';
import CardForObject from './CardForObject';

const DeezerMixInput = ({ selected, setSelected }) => {
  const loadedData = useLoadedData(mixesUrl());
  const { data } = loadedData;
  return (
    <Grid container spacing={2}>
      <Grid item>
        <CardForObject
          selected={selected === ''}
          action={() => setSelected('')}
          object={{
            picture: '',
            description: '',
            title: 'None',
          }}
        />
      </Grid>
      {data &&
        data.map((mix) => (
          <Grid item key={mix.id}>
            <CardForObject
              selected={selected === mix.id}
              action={() => setSelected(mix.id)}
              object={mix}
            />
          </Grid>
        ))}
    </Grid>
  );
};

export default DeezerMixInput;
