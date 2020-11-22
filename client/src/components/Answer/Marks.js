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
import RemoveIcon from '@material-ui/icons/Remove';
import defaultAnswer from './default';
// FIXME: to the about page I guess
//<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

const posToIcon = (pos) => {
  switch (pos) {
    case 1:
      return FirstIcon;
    case 2:
      return SecondIcon;
    case 3:
      return ThirdIcon;
    default:
      return RemoveIcon;
  }
};

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

const Marks = ({
  data,
}) => {
  const { 
    artist,
    title,
    fast,
    worthy_position,
  } = data ? data : defaultAnswer;
  const { root } = useStyles();
  const PosIcon = posToIcon(worthy_position);
  return (
    <div className={root}>
      <StatusIcon Component={MicIcon} isValid={artist} />
      <StatusIcon Component={MusicNoteRoundedIcon} isValid={title} />
      <StatusIcon Component={OfflineBoltOutlinedIcon} isValid={fast} />
      <Box ml={0.5}>
        <PosIcon fontSize="small" />
      </Box>
    </div>
  )
};

export default Marks;
