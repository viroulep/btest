import React from 'react';
import clsx from 'clsx';

import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
  fullHeight: {
    height: '100%',
  },
  songs: {
    marginLeft: theme.spacing(1),
  },
  test: {
    flexGrow: 1,
  },
}));

const CardForObject = ({ selected, object, action }) => {
  const { title, description, picture, nb_tracks } = object;
  const classes = useStyles();
  return (
    <Card
      className={clsx(classes.fullHeight, selected && classes.selected)}
      variant="outlined"
    >
      <CardActionArea onClick={action} className={classes.fullHeight}>
        <Box height="100%">
          <CardMedia
            className={classes.image}
            image={picture}
            component="div"
            title={`Cover for ${title}`}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="h4">
              {title}
              {nb_tracks && (
                <span className={classes.songs}>({nb_tracks} songs)</span>
              )}
            </Typography>
            {description.length > 0 && (
              <Typography variant="body2">{description}</Typography>
            )}
            <div className={classes.test} />
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default CardForObject;
