import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import AnswerForm from '../Answer/Form';
import PreviewProgress from './PreviewProgress';
import UserContext from '../../contexts/UserContext';
import { currentAnswer } from '../../logic/game';

const useStyles = makeStyles((theme) => ({
  stateItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: '100px',
  },
}));

const State = ({ slug, currentTrack, rankings, preview }) => {
  const me = useContext(UserContext);
  const { stateItem } = useStyles();
  return (
    <>
      <Grid item className={stateItem} xs={12} md={2}>
        <Typography align="center">{currentTrack + 1}/15</Typography>
      </Grid>
      <Grid item xs={12} md={10}>
        <AnswerForm
          slug={slug}
          currentTrack={currentTrack}
          currentAnswer={currentAnswer(rankings, me)}
        />
      </Grid>
      <Grid item xs={12}>
        <PreviewProgress preview={preview} />
      </Grid>
    </>
  );
};

export default State;
