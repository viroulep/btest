import React from 'react';

import { useTheme, makeStyles } from '@material-ui/core/styles';
import { Box, Grid, IconButton, Link } from '@material-ui/core';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';

const useStyles = makeStyles((theme) => ({
  link: {
    '&:hover': {
      textDecoration: 'none',
      opacity: 0.7,
    },
  },
  grow: {
    flexGrow: 1,
  },
}));

const Footer = ({ toggle }) => {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <Box p={1}>
      <Grid container spacing={1}>
        <Grid item>
          <IconButton size="small" onClick={toggle} aria-label="Toggle theme">
            {theme.palette.type === 'dark' ? (
              <EmojiObjectsIcon />
            ) : (
              <EmojiObjectsOutlinedIcon />
            )}
          </IconButton>
        </Grid>
        <Grid item className={classes.grow} />
        <Grid item>
          <Link className={classes.link} variant="subtitle1" to="/about">
            About
          </Link>
        </Grid>
        <Grid item>
          <Link
            className={classes.link}
            variant="subtitle1"
            href="https://github.com/viroulep/btest"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
