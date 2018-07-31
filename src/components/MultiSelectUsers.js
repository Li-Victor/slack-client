import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { Query } from 'react-apollo';

import { GET_TEAMMEMBERS_QUERY } from '../graphql/team';

const MultiSelectUsers = ({
  value, placeholder, teamId, handleChange, currentUserId
}) => (
  <Query query={GET_TEAMMEMBERS_QUERY} variables={{ teamId }}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;
      const { getTeamMembers = [] } = data;
      return (
        <Dropdown
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          fluid
          multiple
          search
          selection
          options={getTeamMembers
            .filter(tm => tm.id !== currentUserId)
            .map(tm => ({ key: tm.id, value: tm.id, text: tm.username }))}
        />
      );
    }}
  </Query>
);

export default MultiSelectUsers;
