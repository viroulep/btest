import React from 'react';
import { Button, Card, CardContent, CardActions } from '@material-ui/core';

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
      </CardContent>
      <CardActions>
        <Button variant="outlined" onClick={toggle}>Test button</Button>
      </CardActions>
    </Card>
  );
};

export default Welcome;
