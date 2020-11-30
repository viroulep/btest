import React from 'react';
import Marks from '../Answer/Marks';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FirstIcon from '../Icons/First';
import SecondIcon from '../Icons/Second';
import ThirdIcon from '../Icons/Third';

const rankToIcon = {
  1: FirstIcon,
  2: SecondIcon,
  3: ThirdIcon,
};

const useStyles = makeStyles((theme) => ({
  root: {
    //maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  rankStyle: {
    width: '20px',
    textAlign: 'center',
  },
}));

const IconForRank = ({ rank }) => {
  const { rankStyle } = useStyles();
  const Icon = rankToIcon[rank];
  return Icon ? (
    <Icon />
  ) : (
    <Typography className={rankStyle}>{rank}</Typography>
  );
};

const RankingItem = ({ rank, value }) => {
  // TODO: it would be nice to not display valid marks if the game
  // is over/aborted!
  const { name, points, current } = value;
  return (
    <ListItem>
      <ListItemIcon>
        <IconForRank rank={rank} />
      </ListItemIcon>
      <ListItemText
        primary={name}
        secondary={<Marks data={current} />}
        secondaryTypographyProps={{
          component: 'span',
        }}
      />
      <ListItemSecondaryAction>{points} points</ListItemSecondaryAction>
    </ListItem>
  );
};

const Rankings = ({ rankings }) => {
  const { root } = useStyles();
  return (
    <>
      <Box mb={1}>
        <Typography component="h3" variant="h4">
          Rankings
        </Typography>
      </Box>
      <List className={root}>
        {rankings.map((v, k) => (
          <RankingItem key={k} value={v} rank={k + 1} />
        ))}
      </List>
    </>
  );
};

export default Rankings;
