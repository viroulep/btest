import React, { useRef, useState, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetchJsonOrError } from '../../requests/fetchJsonOrError';
import { updateMeUrl } from '../../requests/routes';
import Snackbar from '../Snackbar/Snack';
import PositiveButton from '../Buttons/Positive';
import ProvidedData from './Provided';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  mb: {
    marginBottom: theme.spacing(2),
  },
}));

// FIXME: somehow this should be shared by client/server.
const prefix = 'anonymous_';
const splitAnonymousName = (name) => name.replace(prefix, '');
const prefixAnonymousName = (name) => `${prefix}${name}`;

const nameToRequestParams = (name) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user: { name } }),
});

const handler = (data, setSnack, setError, sync) => {
  const { success, message } = data;
  if (success) {
    setSnack({
      open: true,
      message: 'Succesfully upated your name!',
    });
    sync();
  } else {
    setError(message);
  }
  // sync !
};

const EditProfile = ({ me, sync }) => {
  const { name, anonymous } = me;
  const nameRef = useRef(null);
  const [newName, setNewName] = useState(
    anonymous ? splitAnonymousName(name) : name
  );
  const [error, setError] = useState('');
  const [snack, setSnack] = useState({
    open: false,
  });
  const { flex, mb } = useStyles();
  const updateName = useCallback(
    (ev) => {
      ev.preventDefault();
      let nameParam = nameRef.current.value;
      if (anonymous) {
        nameParam = prefixAnonymousName(nameParam);
      }
      // TODO: catch
      fetchJsonOrError(
        updateMeUrl(),
        nameToRequestParams(nameParam)
      ).then((data) => handler(data, setSnack, setError, sync));
    },
    [anonymous, nameRef, setSnack, setError, sync]
  );

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h4">Edit your profile</Typography>}
      />
      <CardContent>
        <Snackbar snack={snack} setSnack={setSnack} />
        <form noValidate autoComplete="off">
          {!anonymous && <ProvidedData me={me} />}
          <div className={flex}>
            <Typography variant="h6" className={mb}>
              Local data
            </Typography>
            <TextField
              variant="outlined"
              inputProps={{
                ref: nameRef,
              }}
              error={error.length !== 0}
              label="Your displayed name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={mb}
              helperText={error}
            />
            <PositiveButton
              onClick={updateName}
              variant="contained"
              type="submit"
            >
              Save
            </PositiveButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProfile;
