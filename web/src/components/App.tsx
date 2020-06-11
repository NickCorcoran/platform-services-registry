import styled from '@emotion/styled';
import { KeycloakProvider } from '@react-keycloak/web';
import React from 'react';
import keycloak from '../keycloak';
import Header from './Header';

const StyledApp = styled.div`
  text-align: center;
`;

const App = () => {
  return <KeycloakProvider keycloak={keycloak}>
    <StyledApp >
      <Header />
    </StyledApp>
  </KeycloakProvider>
}

export default App;
