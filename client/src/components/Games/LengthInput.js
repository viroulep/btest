import React, { forwardRef, useState } from 'react';

import { FormControlLabel, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  ml: {
    marginLeft: theme.spacing(2),
  },
}));

const LengthInput = forwardRef((props, ref) => {
  const [value, setValue] = useState(15);
  const { ml } = useStyles();
  return (
    <FormControlLabel
      control={
        <Input
          type="number"
          className={ml}
          inputProps={{
            ref,
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      }
      label="Number of tracks"
      labelPlacement="start"
    />
  );
});

export default LengthInput;
