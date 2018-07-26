import React from 'react';
import { Query, Mutation } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';
import Sidebar from '../containers/Sidebar';
import DirectMessageContainer from '../containers/DirectMessageContainer';
import { ME_QUERY, DIRECT_MESSAGE_ME_QUERY, CREATE_DIRECTMESSAGE_MUTATION } from '../graphql/team';

const DirectMessages = ({
  team, teams, username, userId, teamId, getUser
}) => (
  <Mutation mutation={CREATE_DIRECTMESSAGE_MUTATION}>
    {createDirectMessage => (
      <AppLayout>
        <Sidebar
          teams={teams.map(t => ({
            id: t.id,
            letter: t.name.charAt(0).toUpperCase()
          }))}
          team={team}
          username={username}
        />

        <Header channelName={getUser.username} />
        <DirectMessageContainer teamId={team.id} userId={userId} />
        <SendMessage
          onSubmit={async text => {
            const response = await createDirectMessage({
              variables: {
                text,
                receiverId: userId,
                teamId
              },
              optimisticResponse: {
                createDirectMessage: true
              },
              update: store => {
                const data = store.readQuery({ query: ME_QUERY });
                const teamIdx = findIndex(data.me.teams, ['id', team.id]);
                const notAlreadyThere = data.me.teams[teamIdx].directMessageMembers.every(
                  member => member.id !== parseInt(userId, 10)
                );

                if (notAlreadyThere) {
                  data.me.teams[teamIdx].directMessageMembers.push({
                    __typename: 'User',
                    id: userId,
                    username: getUser.username
                  });
                  store.writeQuery({ query: ME_QUERY, data });
                }
              }
            });
            console.log(response);
          }}
          placeholder={userId}
        />
      </AppLayout>
    )}
  </Mutation>
);

export default ({
  match: {
    params: { teamId, userId }
  }
}) => (
  <Query query={DIRECT_MESSAGE_ME_QUERY} variables={{ userId }} fetchPolicy="network-only">
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      const { me, getUser } = data;
      const { teams, username } = me;

      if (teams.length === 0) {
        return <Redirect to="/create-team" />;
      }

      const teamIdInteger = parseInt(teamId, 10);
      const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
      const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

      return (
        <DirectMessages
          team={team}
          teams={teams}
          username={username}
          userId={userId}
          teamId={teamId}
          getUser={getUser}
        />
      );
    }}
  </Query>
);
