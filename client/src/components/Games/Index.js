import React, { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Paper, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {
  availableGamesUrl,
  pastGamesUrl,
  adminGamesUrl,
} from '../../requests/routes';

import UserContext from '../../contexts/UserContext';
import GamesTab from './GamesTab';
import Snackbar from '../Snackbar/Snack';
import PositiveButton from '../Buttons/Positive';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  addButton: {
    marginBottom: theme.spacing(2),
  },
}));

const GamesIndex = () => {
  // FIXME: this should be a "SnackContext" common to the app!
  const [snack, setSnack] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const { anonymous, admin } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(0);
  const { addButton } = useStyles();

  return (
    <>
      <Snackbar snack={snack} setSnack={setSnack} />
      <Paper>
        {!anonymous && (
          <PositiveButton
            className={addButton}
            variant="contained"
            //onClick={createGame}
            startIcon={<AddIcon />}
            fullWidth
            component={RouterLink}
            to="/games/new"
          >
            New
          </PositiveButton>
        )}
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(ev, value) => setActiveTab(value)}
          aria-label="games tabs"
          centered
        >
          <Tab label="Available" />
          <Tab label="Past" />
          {admin && <Tab label="Admin" />}
        </Tabs>
        <GamesTab active={activeTab} index={0} url={availableGamesUrl} />
        <GamesTab active={activeTab} index={1} url={pastGamesUrl} />
        {admin && <GamesTab active={activeTab} index={2} url={adminGamesUrl} />}
      </Paper>
    </>
  );
};

export default GamesIndex;
