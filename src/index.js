import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import 'semantic-ui-css/semantic.min.css';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';

const afterwareLink = new ApolloLink((operation, forward) => forward(operation).map(response => {
  const {
    response: { headers }
  } = operation.getContext();
  if (headers) {
    const token = headers.get('x-token');
    const refreshToken = headers.get('x-refresh-token');
    if (token) {
      localStorage.setItem('token', token);
    }

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  return response;
}));

const client = new ApolloClient({
  link: ApolloLink.from([
    afterwareLink,
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) graphQLErrors.map(({ message, locations, path }) => console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: 'http://localhost:5000/graphql',
      credentials: 'same-origin',
      headers: {
        'x-token': localStorage.getItem('token'),
        'x-refresh-token': localStorage.getItem('refreshToken')
      }
    })
  ]),
  cache: new InMemoryCache()
});

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
