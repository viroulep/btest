import React from 'react';

import AwardIcon from './AwardIcon';
import { ReactComponent as IconSvg } from './third.svg';

const Icon = (props) => <AwardIcon svg={IconSvg} {...props} />;

export default Icon;
