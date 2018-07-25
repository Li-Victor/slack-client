import React from 'react';

import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
    openInvitePeopleModal: false
  };

  toggleAddChannelModal = e => {
    if (e) e.preventDefault();
    this.setState(state => ({ openAddChannelModal: !state.openAddChannelModal }));
  };

  toggleInvitePeopleModal = e => {
    if (e) e.preventDefault();
    this.setState(state => ({ openInvitePeopleModal: !state.openInvitePeopleModal }));
  };

  render() {
    const { teams, team, username } = this.props;
    const { openAddChannelModal, openInvitePeopleModal } = this.state;

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
          onAddChannelClick={this.toggleAddChannelModal}
          onInvitePeopleClick={this.toggleInvitePeopleModal}
          isOwner={team.admin}
        >
          Channels
        </Channels>
        <AddChannelModal
          open={openAddChannelModal}
          teamId={team.id}
          onClose={this.toggleAddChannelModal}
        />
        <InvitePeopleModal
          open={openInvitePeopleModal}
          teamId={team.id}
          onClose={this.toggleInvitePeopleModal}
        />
      </React.Fragment>
    );
  }
}

export default Sidebar;
