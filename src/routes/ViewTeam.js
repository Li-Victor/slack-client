import React from 'react';
import { Query, Mutation } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import MessageContainer from '../containers/MessageContainer';
import { ME_QUERY, CREATE_MESSAGE_MUTATION } from '../graphql/team';

const ViewTeam = ({
  team, teams, username, channel, currentUserId
}) => (
  <Mutation mutation={CREATE_MESSAGE_MUTATION}>
    {createMessage => (
      <AppLayout>
        <Sidebar
          teams={teams.map(t => ({
            id: t.id,
            letter: t.name.charAt(0).toUpperCase()
          }))}
          team={team}
          username={username}
          currentUserId={currentUserId}
        />
        {channel && (
          <React.Fragment>
            <Header channelName={channel.name} />
            <MessageContainer channelId={channel.id} />
            <SendMessage
              placeholder={channel.name}
              onSubmit={async text => {
                await createMessage({ variables: { text, channelId: channel.id } });
              }}
            />
          </React.Fragment>
        )}
      </AppLayout>
    )}
  </Mutation>
);

export default ({
  match: {
    params: { teamId, channelId }
  }
}) => (
  <Query query={ME_QUERY} fetchPolicy="network-only">
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      const { me } = data;
      const { teams, username, id: currentUserId } = me;

      if (teams.length === 0) {
        return <Redirect to="/create-team" />;
      }

      const teamIdInteger = parseInt(teamId, 10);
      const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
      const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

      const channelIdInteger = parseInt(channelId, 10);
      const channelIdx = channelIdInteger ? findIndex(team.channels, ['id', channelIdInteger]) : 0;
      const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];
      console.log(currentUserId);

      return <ViewTeam team={team} teams={teams} username={username} channel={channel} currentUserId={currentUserId} />;
    }}
  </Query>
);
