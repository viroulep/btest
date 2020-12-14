import React, { useContext, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Checkbox,
  Grid,
  Popover,
  Slider,
  Typography,
  IconButton,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InfoIcon from '@material-ui/icons/Info';
import ShareIcon from '@material-ui/icons/Share';

import AnswerForm from '../Answer/Form';
import Preview from './Preview';
import PreviewProgress from './PreviewProgress';
import Status from './Status';
import UserContext from '../../contexts/UserContext';
import SnackContext from '../../contexts/SnackContext';
import { currentAnswer, copyUrlToClipboard } from '../../logic/game';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

const useStyles = makeStyles((theme) => ({
  stateItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    minWidth: '100px',
  },
  volumeButtonRoot: {
    textAlign: 'center',
  },
  popoverRoot: {
    minWidth: '200px',
  },
}));

const State = ({ game, preview }) => {
  const me = useContext(UserContext);
  const openSnack = useContext(SnackContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [volume, setVolume] = useState(80);
  const { stateItem, volumeButtonRoot, popoverRoot } = useStyles();
  const { slug, currentTrack, rankings, totalTracks } = game;
  const [showStatus, setShowStatus] = useState(!game.available);
  return (
    <>
      <Grid item className={stateItem} xs={12} md={2}>
        <Preview preview={preview} volume={volume} />
        <Typography align="center">
          {currentTrack + 1}/{totalTracks}
        </Typography>
        <Box className={volumeButtonRoot}>
          <IconButton
            color="secondary"
            aria-label="change volume"
            onClick={(ev) => setAnchorEl(ev.currentTarget)}
          >
            <VolumeUpIcon />
          </IconButton>
          <Checkbox
            checked={showStatus}
            onChange={(ev) => setShowStatus(ev.target.checked)}
            icon={<InfoOutlinedIcon />}
            checkedIcon={<InfoIcon />}
          />
          <IconButton
            color="secondary"
            aria-label="change volume"
            onClick={() => copyUrlToClipboard(openSnack)}
          >
            <ShareIcon />
          </IconButton>
        </Box>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
        >
          <Box className={popoverRoot} my={1} mx={3}>
            <Slider
              value={volume}
              color="secondary"
              onChange={(ev, newValue) => setVolume(newValue)}
            />
          </Box>
        </Popover>
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
      {showStatus && (
        <Grid item xs={12}>
          <Status game={game} />
        </Grid>
      )}
    </>
  );
};

export default State;
