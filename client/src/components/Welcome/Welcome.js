import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import { signInProviders } from '../../requests/routes';

const Welcome = ({
  user,
  toggle,
}) => (
  <Card>
    <CardContent>
      <h1>Welcome {user.name} !</h1>
      <Typography paragraph>
        Some smart text about the website.
        <br/>
        Checkout the
        {' '}
        <Link to="/games" component={RouterLink} >
          games
        </Link>
      </Typography>
      {user.anonymous ? (
        <>
          <Box mb={2}>
            <Typography>
              It looks like you're anonymous, you can login using a provider below.
              <br/>
              In any case you can change your displayed name in your
              {' '}
              <Link to="/profile" component={RouterLink} >
                profile
              </Link>
            </Typography>
          </Box>
          <List>
            {signInProviders.map((p) => (
              <form action={p.url} method='POST' key={p.id}>
                <ListItem button type='submit' component='button'>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Sign in with ${p.name}`}
                  />
                </ListItem>
              </form>
            ))}
          </List>
        </>
      ) : (
        <Typography>
          If you want you can change your displayed name in your
          {' '}
          <Link to="/profile" component={RouterLink} >
            profile
          </Link>
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default Welcome;
