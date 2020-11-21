import React from 'react';


import { Box, SvgIcon, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MicIcon from '@material-ui/icons/Mic';
import MusicNoteRoundedIcon from '@material-ui/icons/MusicNoteRounded';
import OfflineBoltOutlinedIcon from '@material-ui/icons/OfflineBoltOutlined';
import StatusIcon from '../Icons/StatusIcon';
import { ReactComponent as FirstIcon } from '../Icons/first.svg';
import { ReactComponent as SecondIcon } from '../Icons/second.svg';
import { ReactComponent as ThirdIcon } from '../Icons/third.svg';
// FIXME: to the about page I guess
//<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

const defaultAnswer = {
  artist: false,
  title: false,
  fast: false,
  worthy_position: 0,
  total_points: 0,
};

const posToComponent = pos => {
  switch (pos) {
    case 1:
      return FirstIcon;
    case 2:
      return SecondIcon;
    case 3:
      return ThirdIcon;
    default:
      throw new Error();
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
    total_points
  } = data ? data : defaultAnswer;
  const { root } = useStyles();
  return (
    <div className={root}>
      <StatusIcon Component={MicIcon} isValid={artist} />
      <StatusIcon Component={MusicNoteRoundedIcon} isValid={title} />
      <StatusIcon Component={OfflineBoltOutlinedIcon} isValid={fast} />
      {worthy_position > 0 && (
        <Box ml={0.5}>
          <SvgIcon
            fontSize="small"
            component={posToComponent(worthy_position)}
            viewBox="0 0 580 430"
          />
        </Box>
      )}
    </div>
  )
};

export default Marks;
