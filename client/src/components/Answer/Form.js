import React, { useState, useEffect, useCallback, useRef } from 'react';

import { Box, Grid, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SendRoundedIcon from '@material-ui/icons/SendRounded';

import { gameAttemptUrl } from '../../requests/routes';
import { usePostFetch } from '../../hooks/requests';
import Marks from '../Answer/Marks';
import FormStatus from './FormStatus';

const defaultStatus = {
  success: false,
  message: '',
};

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  fullHeight: {
    height: '100%',
  },
  toUpper: {
    textTransform: 'uppercase',
  },
  gridInput: {
    marginBottom: theme.spacing(1),
  },
  marksItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

const AnswerForm = ({ slug, currentTrack, currentAnswer }) => {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState(defaultStatus);
  const refTextField = useRef(null);
  const { fetcher } = usePostFetch();

  // Reset on game/track change
  useEffect(() => {
    setValue('');
    setStatus(defaultStatus);
  }, [slug, currentTrack]);

  const submitAnswer = useCallback(
    (ev) => {
      ev.preventDefault();
      const query = refTextField.current.value;
      if (query.length <= 0) {
        return;
      }
      fetcher(gameAttemptUrl(slug), { q: query }).then(setStatus);
      setValue('');
      // Set the focus back to the text field
      refTextField.current.focus();
    },
    [slug, setValue, setStatus, fetcher]
  );

  const { grow, fullHeight, toUpper, gridInput, marksItem } = useStyles();

  return (
    <Box>
      <form onSubmit={submitAnswer}>
        <Grid container direction="row" spacing={2} className={gridInput}>
          <Grid item className={grow}>
            <TextField
              placeholder="Type in something"
              variant="outlined"
              inputProps={{
                className: toUpper,
                name: 'query',
                ref: refTextField,
              }}
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              className={fullHeight}
              variant="contained"
              color="primary"
              aria-label="send-answer"
            >
              <SendRoundedIcon />
            </Button>
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={2} className={gridInput}>
          <Grid item className={marksItem}>
            <Marks data={currentAnswer} />
          </Grid>
          <Grid item className={grow}>
            <FormStatus status={status} />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AnswerForm;
