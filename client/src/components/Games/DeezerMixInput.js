import React from 'react';

import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import useLoadedData from '../../requests/loadable';
import { mixesUrl } from '../../requests/routes';

const useStyles = makeStyles((theme) => ({
  image: {
    height: 140,
    backgroundColor: theme.palette.text.secondary,
  },
  selected: {
    borderColor: theme.palette.success.main,
    borderWidth: '3px',
    borderStyle: 'solid',
  },
}));

const CardForMix = ({ selected, setSelected, mix }) => {
  const classes = useStyles();
  const { id, picture, title } = mix;
  return (
    <Card className={selected === id ? classes.selected : ''}>
      <CardActionArea onClick={() => setSelected(id)}>
        <CardMedia
          className={classes.image}
          image={picture}
          component="div"
          title={`Cover for ${title}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h4">
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const DeezerMixInput = ({ selected, setSelected }) => {
  const loadedData = useLoadedData(mixesUrl());
  const { data } = loadedData;
  return (
    <Grid container spacing={2}>
      <Grid item>
        <CardForMix
          selected={selected}
          setSelected={setSelected}
          mix={{
            picture: '',
            id: '',
            title: 'None',
          }}
        />
      </Grid>
      {data &&
        data.map((mix) => (
          <Grid item key={mix.id}>
            <CardForMix
              selected={selected}
              setSelected={setSelected}
              mix={mix}
            />
          </Grid>
        ))}
    </Grid>
  );
};

export default DeezerMixInput;
