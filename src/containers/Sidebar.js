import React from 'react';
import decode from 'jwt-decode';

import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';

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
    const { teams, team } = this.props;
    const { openAddChannelModal } = this.state;

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
      <React.Fragment>
        <Teams
          teams={teams}
        >
          Teams
        </Teams>
        <Channels
          teamName={team.name}
          username={username}
          teamId={team.id}
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
          teamId={team.id}
          onClose={this.handleCloseAddAddChannelModel}
        />
      </React.Fragment>
    );
  }
}

export default Sidebar;
