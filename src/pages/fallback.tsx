import { Button } from '@entur/button';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const Fallback = () => {
  const auth0 = useAuth0();

  return (
    <Button
      width="auto"
      variant="primary"
      size="medium"
      onClick={() =>
        auth0.logout({
          returnTo: window.location.origin,
        })
      }
    >
      Logout
    </Button>
  );
};
