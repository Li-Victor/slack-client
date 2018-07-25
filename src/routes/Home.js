import React from 'react';
import { Query } from 'react-apollo';

import { ALL_USERS_QUERY } from '../graphql/team';

const Home = () => (
  <Query query={ALL_USERS_QUERY}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      return data.allUsers.map(u => (
        <h1 key={u.id}>
          {u.email}
        </h1>
      ));
    }}
  </Query>
);

export default Home;
