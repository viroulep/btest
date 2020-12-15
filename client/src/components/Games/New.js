import React, { useCallback, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { usePostFetch } from '../../hooks/requests';
import { gamesUrl } from '../../requests/routes';
import DeezerMixInput from './DeezerMixInput';
import PlaylistsInput from './PlaylistsInput';
import ValidatorSelect from './ValidatorSelect';
import LengthInput from './LengthInput';

const useStyles = makeStyles((theme) => ({
  heading: {
    flexBasis: '33%',
    flexShrink: 0,
  },
  subHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const SourceAccordion = ({
  selected,
  setSelected,
  sourceType,
  header,
  subHeader,
  children,
}) => {
  // 'expanded' holds the "new" state of the accordion.
  const onChangeAction = useCallback(
    (event, expanded) => setSelected(expanded ? sourceType : ''),
    [sourceType, setSelected]
  );
  const classes = useStyles();

  return (
    <Accordion expanded={selected === sourceType} onChange={onChangeAction}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${sourceType}-content`}
      >
        <Typography className={classes.heading} variant="h5">
          {header}
        </Typography>
        <Typography className={classes.subHeading}>{subHeader}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

const NewGameForm = () => {
  // FIXME: really need error handling here...
  const history = useHistory();
  const lengthRef = useRef(null);
  const validatorRef = useRef(null);
  const [mix, setMix] = useState('');
  const [playlists, setPlaylists] = useState({});
  const { fetcher, openSnack } = usePostFetch();
  const [loading, setLoading] = useState(false);

  const [selectedSource, setSelectedSource] = useState('');

  const createGameAction = useCallback(() => {
    let sourceData = null;
    if (selectedSource === 'deezer_mix') {
      sourceData = mix;
    } else if (selectedSource === 'playlists') {
      sourceData = Object.values(playlists)
        .filter((p) => p.selected)
        .map((p) => p.id)
        .join(',');
    }
    setLoading(true);
    fetcher(gamesUrl(), {
      length: lengthRef.current.value,
      validator: validatorRef.current.value.toLowerCase(),
      source: {
        type: selectedSource,
        data: sourceData,
      },
    })
      .then((data) => {
        const { success, message, newGameSlug } = data;
        if (success) {
          // Nagivate to the list of available games
          history.push(`/games/${newGameSlug}`);
        } else {
          openSnack({ message });
        }
      })
      .finally(() => setLoading(false));
  }, [history, openSnack, mix, playlists, selectedSource, setLoading, fetcher]);

  return (
    <>
      <Grid item>
        <LengthInput ref={lengthRef} />
      </Grid>
      <Grid item>
        <ValidatorSelect ref={validatorRef} />
      </Grid>
      <Grid item>
        <SourceAccordion
          selected={selectedSource}
          setSelected={setSelectedSource}
          sourceType="deezer_mix"
          header="Deezer mix"
          subHeader="Create the tracklist from an existing Deezer mix"
        >
          <DeezerMixInput selected={mix} setSelected={setMix} />
        </SourceAccordion>
        <SourceAccordion
          selected={selectedSource}
          setSelected={setSelectedSource}
          sourceType="playlists"
          header="Custom playlists"
          subHeader="Use one or more playlist to create the tracklist"
        >
          <PlaylistsInput playlists={playlists} setPlaylists={setPlaylists} />
        </SourceAccordion>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={createGameAction}
          disabled={selectedSource === '' || loading}
        >
          Create from {selectedSource}
        </Button>
      </Grid>
    </>
  );
};

const NewGame = () => (
  <Box p={2}>
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Typography variant="h4">Create a game</Typography>
        <Alert severity="info">
          The number of tracks must be between 5 and 50.
        </Alert>
      </Grid>
      <NewGameForm />
    </Grid>
  </Box>
);

export default NewGame;
