import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
import { Alert } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';

import UserContext from '../../contexts/UserContext';
import { signInProviders } from '../../requests/routes';

const Welcome = ({ toggle }) => {
  const user = useContext(UserContext);
  return (
    <Card>
      <CardContent>
        <h1>Welcome {user.name} !</h1>
        <Typography paragraph>
          Some smart text about the website.
          <br />
          Checkout the{' '}
          <Link to="/games" component={RouterLink}>
            games
          </Link>
        </Typography>
        {user.anonymous ? (
          <>
            <Box mb={2}>
              <Typography>
                It looks like you're anonymous, you can sign in using a provider
                below.
                <br />
                In any case you can change your displayed name in your{' '}
                <Link to="/profile" component={RouterLink}>
                  profile
                </Link>
              </Typography>
              <Alert severity="info">
                Currently signing in will only work with the developer's email
              </Alert>
            </Box>
            <List>
              {signInProviders.map((p) => (
                <form action={p.url} method="POST" key={p.id}>
                  <ListItem button type="submit" component="button">
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`Sign in with ${p.name}`} />
                  </ListItem>
                </form>
              ))}
            </List>
          </>
        ) : (
          <Typography>
            If you want you can change your displayed name in your{' '}
            <Link to="/profile" component={RouterLink}>
              profile
            </Link>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default Welcome;
