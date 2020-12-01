import React from 'react';

import { SvgIcon } from '@material-ui/core';

const AwardIcon = ({ svg, ...props }) => (
  <SvgIcon component={svg} viewBox="0 0 580 430" {...props} />
);

export default AwardIcon;
