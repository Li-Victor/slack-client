import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import decode from 'jwt-decode';
import findIndex from 'lodash/findIndex';

import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';

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

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false
  };

  handleAddChannelClick = () => {
    this.setState({ openAddChannelModal: true });
  };

  handleCloseAddAddChannelModel = () => {
    this.setState({ openAddChannelModal: false });
  };

  render() {
    const {
      allTeams, team, username, currentTeamId
    } = this.props;
    const { openAddChannelModal } = this.state;

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
          onAddChannelClick={this.handleAddChannelClick}
        >
          Channels
        </Channels>
        <AddChannelModal
          open={openAddChannelModal}
          teamId={currentTeamId}
          onClose={this.handleCloseAddAddChannelModel}
        />
      </React.Fragment>
    );
  }
}

export default ({ currentTeamId }) => (
  <Query query={ALL_TEAMS}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      const { allTeams } = data;

      const teamIdx = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;
      const team = allTeams[teamIdx];

      const username = (() => {
        try {
          const token = localStorage.getItem('token');
          const { user } = decode(token);
          return user.username;
        } catch (err) {
          return '';
        }
      })();

      return (
        <Sidebar
          team={team}
          username={username}
          allTeams={allTeams}
          currentTeamId={currentTeamId}
        />
      );
    }}
  </Query>
);
