import React, { useCallback, useContext, useState } from 'react';

import {
  Paper,
  Switch,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@material-ui/core';

import useLoadedData from '../../requests/loadable';
import { fetchJsonOrError } from '../../requests/fetchJsonOrError';
import { usersUrl, userUrl } from '../../requests/routes';
import WithLoading from '../WithLoading/WithLoading';
import SnackContext from '../../contexts/SnackContext';

const UsersList = ({ users, sync }) => {
  const openSnack = useContext(SnackContext);
  const [loading, setLoading] = useState(null);
  const toggleUserAdmin = useCallback(
    (id, admin) => {
      setLoading(id);
      fetchJsonOrError(userUrl(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { admin } }),
      })
        .then((data) => {
          if (data.success) sync();
          openSnack(data);
        })
        .finally(() => setLoading(null));
    },
    [sync, openSnack]
  );
  return (
    <TableContainer component={Paper}>
      <Table aria-label="users table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Admin</TableCell>
            <TableCell align="right">Provider</TableCell>
            <TableCell align="right">Provided name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell component="th" scope="row">
                {user.name}
              </TableCell>
              <TableCell align="right">{user.provided_email}</TableCell>
              <TableCell align="right">
                <Switch
                  checked={user.admin}
                  disabled={loading === user.id}
                  onChange={(ev) => toggleUserAdmin(user.id, ev.target.checked)}
                  name={`switch-admin-${user.id}`}
                  inputProps={{ 'aria-label': 'checkbox admin' }}
                />
              </TableCell>
              <TableCell align="right">{user.provider}</TableCell>
              <TableCell align="right">{user.provided_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const UsersIndex = () => {
  const loadedData = useLoadedData(usersUrl());
  const { data, sync } = loadedData;
  return (
    <>
      <Typography variant="h3">Users</Typography>
      <WithLoading
        Component={UsersList}
        loadedData={loadedData}
        users={data}
        sync={sync}
      />
    </>
  );
};

export default UsersIndex;
