import React from 'react';

import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import MicIcon from '@material-ui/icons/Mic';
import MusicNoteRoundedIcon from '@material-ui/icons/MusicNoteRounded';
import OfflineBoltOutlinedIcon from '@material-ui/icons/OfflineBoltOutlined';

import StatusIcon from '../Icons/StatusIcon';
import FirstIcon from '../Icons/First';
import SecondIcon from '../Icons/Second';
import ThirdIcon from '../Icons/Third';
import defaultAnswer from './default';
// FIXME: to the about page I guess
//<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

const posToIcon = {
  1: FirstIcon,
  2: SecondIcon,
  3: ThirdIcon,
};

const Position = ({ pos }) => {
  const PosIcon = posToIcon[pos];
  return PosIcon ? (
    <Box ml={0.5}>
      <PosIcon fontSize="small" />
    </Box>
  ) : (
    <></>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const Marks = ({ data }) => {
  const { artist, title, fast, worthy_position } = data ? data : defaultAnswer;
  const { root } = useStyles();
  return (
    <div className={root}>
      <StatusIcon Component={MicIcon} isValid={artist} />
      <StatusIcon Component={MusicNoteRoundedIcon} isValid={title} />
      <StatusIcon Component={OfflineBoltOutlinedIcon} isValid={fast} />
      <Position pos={worthy_position} />
    </div>
  );
};

export default Marks;
