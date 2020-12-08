import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';

import {
  FormControlLabel,
  Typography,
  Select,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const validators = ['Levenshtein', 'Metaphone'];

const useStyles = makeStyles((theme) => ({
  ml: {
    marginLeft: theme.spacing(2),
  },
  helper: {
    color: theme.palette.text.secondary,
  },
}));

const ValidatorSelect = forwardRef((props, ref) => {
  const [value, setValue] = useState(validators[0]);
  const { ml, helper } = useStyles();
  return (
    <>
      <FormControlLabel
        label="Answers validation"
        labelPlacement="start"
        control={
          <Select
            inputProps={{
              ref,
            }}
            className={ml}
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
          >
            {validators.map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </Select>
        }
      ></FormControlLabel>
      <Typography className={clsx(helper, ml)}>
        Using the Levenshtein distance will increase the tolerance to the "fat
        fingers" kind of answers, where small typos sneaked in the answer.
        <br />
        Using the Metaphone algorithm will increase the tolerance for the
        answers phonetically close to the original answer.
        <br />
        Levenshtein is a good default.
      </Typography>
    </>
  );
});

export default ValidatorSelect;
