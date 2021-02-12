import React from 'react';
import clsx from 'clsx';

import {
  Box,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PlaylistAnalysisDialog from './PlaylistAnalysisDialog';

const useStyles = makeStyles((theme) => ({
  image: {
    height: 140,
    backgroundColor: theme.palette.text.secondary,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  selected: {
    borderColor: theme.palette.success.main,
    borderWidth: '3px',
    borderStyle: 'solid',
  },
  fullHeight: {
    height: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  songs: {
    marginLeft: theme.spacing(1),
  },
}));

const CardForObject = ({ selected, object, action }) => {
  const { title, description, picture, nb_tracks, unreadable_tracks } = object;
  const classes = useStyles();
  return (
    <Card
      className={clsx(
        classes.root,
        classes.fullHeight,
        selected && classes.selected
      )}
      variant="outlined"
    >
      <CardActionArea onClick={action} className={classes.grow}>
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
          </CardContent>
        </Box>
      </CardActionArea>
      {unreadable_tracks && unreadable_tracks.length !== 0 && (
        <CardActions>
          <PlaylistAnalysisDialog playlist={object} />
        </CardActions>
      )}
    </Card>
  );
};

export default CardForObject;
