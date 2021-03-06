import React, { useRef, useState, useCallback, useContext } from 'react';

import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import UserContext from '../../contexts/UserContext';
import { usePostFetch } from '../../hooks/requests';
import { updateMeUrl } from '../../requests/routes';
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

const EditProfile = ({ sync }) => {
  const { name, anonymous } = useContext(UserContext);
  const nameRef = useRef(null);
  const [newName, setNewName] = useState(
    anonymous ? splitAnonymousName(name) : name
  );
  const [error, setError] = useState('');
  const { fetcher, openSnack } = usePostFetch();
  const { flex, mb } = useStyles();
  const updateName = useCallback(
    (ev) => {
      ev.preventDefault();
      let nameParam = nameRef.current.value;
      if (anonymous) {
        nameParam = prefixAnonymousName(nameParam);
      }
      fetcher(updateMeUrl(), { user: { name: nameParam } }).then((data) => {
        const { success, message } = data;
        if (success) {
          openSnack(data);
          setError('');
          sync();
        } else {
          setError(message);
        }
      });
    },
    [anonymous, nameRef, setError, sync, openSnack, fetcher]
  );

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h4">Edit your profile</Typography>}
      />
      <CardContent>
        <form noValidate autoComplete="off">
          <ProvidedData />
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
