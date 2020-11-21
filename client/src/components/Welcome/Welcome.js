import React from 'react';
import { Card, CardContent, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const Welcome = ({
  user,
  toggle,
}) => {
  return (
    <Card>
      <CardContent>
        <h1>Welcome {user.name} !</h1>
        {user.anonymous && (
          <span>It looks like you're anonymous, care to login?</span>
        )}
        <p>
          Some smart text about the website.
        </p>
        <Link to="/games" component={RouterLink} >
          Games
        </Link>
      </CardContent>
    </Card>
  );
};

export default Welcome;
