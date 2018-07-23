import React from 'react';
import { Query } from 'react-apollo';
import findIndex from 'lodash/findIndex';

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
    <Header channelName={channel.name} />
    <Messages channelId={channel.id}>
      <ul className="message-list">
        <li />
        <li />
      </ul>
    </Messages>
    <SendMessage channelName={channel.name} />
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
      const teamIdx = teamId ? findIndex(allTeams, ['id', parseInt(teamId, 10)]) : 0;
      const team = allTeams[teamIdx];
      const channelIdx = channelId ? findIndex(team.channels, ['id', parseInt(channelId, 10)]) : 0;
      const channel = team.channels[channelIdx];

      return <ViewTeam channel={channel} team={team} allTeams={allTeams} />;
    }}
  </Query>
);
