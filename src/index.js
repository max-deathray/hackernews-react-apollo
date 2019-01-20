import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import { register } from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter } from 'react-router-dom';
import { setContext } from 'apollo-link-context';
import { AUTH_TOKEN } from './constants';
// telling ApolloClient about the subscription server
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});

// this is the websocket connection that knows the subscription endpoint -> very similar to the http endpoint above but uses the ws protocol instead of the http protocol (you're also authenticatin with the authToken)

// Apollo provides a nice way for authentication all requests by using middleware
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// this is the websocket connection that knows the subscription endpoint -> very similar to the http endpoint above but uses the ws protocol instead of the http protocol (you're also authenticatin with the authToken)

// using split ensure proper routing of the requests and updates the constructor call of ApolloClient

// split takes 3 args: 1: test func w/ returns a bool -> if T, pass the 2nd arg, if F, pass the 3rd

// the test function is checking if the requested operation is a subscription (if it is, it will be fwded to the wslink), if not (meaning it's a query or mutation), it will be routed to the httplink.

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN),
    },
  },
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
register();
