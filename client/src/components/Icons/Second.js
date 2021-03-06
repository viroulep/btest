import React from 'react';

import AwardIcon from './AwardIcon';
import { ReactComponent as IconSvg } from './second.svg';

const Icon = (props) => <AwardIcon svg={IconSvg} {...props} />;

export default Icon;
