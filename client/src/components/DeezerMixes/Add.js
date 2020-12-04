import React, { useState, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Box, Paper, TextField, Typography } from '@material-ui/core';

import { mixesUrl } from '../../requests/routes';
import { fetchJsonOrError } from '../../requests/fetchJsonOrError';
import PositiveButton from '../Buttons/Positive';

const AddMix = () => {
  const [mixId, setMixId] = useState('');
  const [disabled, setDisabled] = useState(false);
  const inputRef = useRef(null);
  const history = useHistory();

  const addMixAction = useCallback(
    (ev) => {
      ev.preventDefault();
      setDisabled(true);

      const mixIdValue = inputRef.current.value;
      // TODO: catch
      fetchJsonOrError(mixesUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mix_id: mixIdValue }),
      })
        .then(() => history.push('/'))
        .finally(() => setDisabled(false));
    },
    [inputRef, setDisabled, history]
  );
  return (
    <Paper>
      <Box p={2}>
        <Typography variant="h4">Add a deezer mix</Typography>
        <TextField
          variant="outlined"
          inputProps={{
            ref: inputRef,
          }}
          label="Mix id"
          value={mixId}
          disabled={disabled}
          onChange={(e) => setMixId(e.target.value)}
        />
        <PositiveButton
          onClick={addMixAction}
          variant="contained"
          type="submit"
        >
          Add
        </PositiveButton>
      </Box>
    </Paper>
  );
};

export default AddMix;
