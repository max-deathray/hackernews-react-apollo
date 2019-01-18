import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import { register, unregister } from './serviceWorker';

// import required dependencies from the install packages
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// create the httpLink that will connect your ApolloClient instance with the GraphQL API
const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});

// instantiate ApolloClient by passing in the httpLink and a new instance of InMemoryCache
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// finally: render the root component of your React app (all wrapped up in the ApolloProvider)
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
register();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister();
