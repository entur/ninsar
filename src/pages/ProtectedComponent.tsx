import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';

interface Props {
  component: React.ComponentType;
}

export const ProtectedComponent = ({
  component,
  ...propsForComponent
}: Props) => {
  const Cp = withAuthenticationRequired(component);
  return <Cp {...propsForComponent} />;
};
