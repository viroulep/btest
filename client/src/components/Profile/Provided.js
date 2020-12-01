import React, { useContext } from 'react';

import { Divider, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import UserContext from '../../contexts/UserContext';
import { signInProviders } from '../../requests/routes';

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

const ProvidedData = () => {
  const { flex, mb } = useStyles();

  const { anonymous, provided_name, provider, provided_email } = useContext(
    UserContext
  );

  if (anonymous) return <></>;

  const providerData = signInProviders.find((p) => p.id === provider);
  const { name } = providerData;
  return (
    <div className={flex}>
      <Typography variant="h6" className={mb}>
        Data provided by {name} upon sign in
      </Typography>
      <TextField
        disabled
        label="Name"
        variant="outlined"
        value={provided_name}
        className={mb}
      />
      <TextField
        disabled
        label="Email"
        variant="outlined"
        value={provided_email}
        className={mb}
      />
      <Divider variant="middle" className={mb} />
    </div>
  );
};

export default ProvidedData;
