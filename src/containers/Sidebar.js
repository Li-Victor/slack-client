import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import decode from 'jwt-decode';
import _ from 'lodash';

import Teams from '../components/Teams';
import Channels from '../components/Channels';

const ALL_TEAMS = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

const Sidebar = ({ currentTeamId }) => (
  <Query query={ALL_TEAMS}>
    {({ loading, error, data: { allTeams } }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      const teamIdx = _.findIndex(allTeams, ['id', currentTeamId]);
      const team = allTeams[teamIdx];

      let username = '';
      try {
        const token = localStorage.getItem('token');
        const { user } = decode(token);
        username = user.username;
      } catch (err) {}

      return (
        <React.Fragment>
          <Teams
            teams={allTeams.map(t => ({
              id: t.id,
              letter: t.name.charAt(0).toUpperCase()
            }))}
          >
            Teams
          </Teams>
          <Channels
            teamName={team.name}
            username={username}
            channels={team.channels}
            users={[
              {
                id: 1,
                name: 'slackbot'
              },
              {
                id: 2,
                name: 'user1'
              }
            ]}
          >
            Channels
          </Channels>
        </React.Fragment>
      );
    }}
  </Query>
);

export default Sidebar;
