import React from 'react';
import { Query } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import { ALL_TEAMS } from '../graphql/team';

const ViewTeam = ({ channel, team, allTeams }) => (
  <AppLayout>
    <Sidebar
      teams={allTeams.map(t => ({
        id: t.id,
        letter: t.name.charAt(0).toUpperCase()
      }))}
      team={team}
    />

    {channel && (
      <React.Fragment>
        <Header channelName={channel.name} />
        <Messages channelId={channel.id}>
          <ul className="message-list">
            <li />
            <li />
          </ul>
        </Messages>
        <SendMessage channelName={channel.name} />
      </React.Fragment>
    )}
  </AppLayout>
);

export default ({
  match: {
    params: { teamId, channelId }
  }
}) => (
  <Query query={ALL_TEAMS}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      const { allTeams } = data;

      if (allTeams.length === 0) {
        return <Redirect to="/create-team" />;
      }

      const teamIdInteger = parseInt(teamId, 10);
      const teamIdx = teamIdInteger ? findIndex(allTeams, ['id', teamIdInteger]) : 0;
      const team = allTeams[teamIdx];

      const channelIdInteger = parseInt(channelId, 10);
      const channelIdx = channelIdInteger ? findIndex(team.channels, ['id', channelIdInteger]) : 0;
      const channel = team.channels[channelIdx];

      return <ViewTeam channel={channel} team={team} allTeams={allTeams} />;
    }}
  </Query>
);
