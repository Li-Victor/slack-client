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

const DirectMessages = ({
  team, teams, username, userId
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
        />

        <React.Fragment>
          {/* <Header channelName={channel.name} />
      <MessageContainer channelId={channel.id} /> */}
          <SendMessage onSubmit={() => {}} placeholder={userId} />
        </React.Fragment>
      </AppLayout>
    )}
  </Mutation>
);

export default ({
  match: {
    params: { teamId, userId }
  }
}) => (
  <Query query={ME_QUERY} fetchPolicy="network-only">
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      const { me } = data;
      const { teams, username } = me;

      if (teams.length === 0) {
        return <Redirect to="/create-team" />;
      }

      const teamIdInteger = parseInt(teamId, 10);
      const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
      const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

      return <DirectMessages team={team} teams={teams} username={username} userId={userId} />;
    }}
  </Query>
);
