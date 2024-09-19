import { ApolloProvider } from '@apollo/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import client from './apis/apolloClient';
import ContextProvider from './context/ContextProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ContextProvider>
  </StrictMode>
);
