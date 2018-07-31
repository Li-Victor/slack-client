import React from 'react';

import Teams from '../components/Teams';
import Channels from '../components/Channels';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';
import DirectMessageModal from '../components/DirectMessageModal';

class Sidebar extends React.Component {
  state = {
    openAddChannelModal: false,
    openInvitePeopleModal: false,
    openDirectMessageModal: false
  };

  toggleDirectMessageModal = e => {
    if (e) e.preventDefault();
    this.setState(state => ({ openDirectMessageModal: !state.openDirectMessageModal }));
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
    const { teams, team, username, currentUserId } = this.props;
    const { openAddChannelModal, openInvitePeopleModal, openDirectMessageModal } = this.state;

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
          users={team.directMessageMembers}
          onAddChannelClick={this.toggleAddChannelModal}
          onInvitePeopleClick={this.toggleInvitePeopleModal}
          onDirectMessageCick={this.toggleDirectMessageModal}
          isOwner={team.admin}
        >
          Channels
        </Channels>
        <AddChannelModal
          open={openAddChannelModal}
          teamId={team.id}
          onClose={this.toggleAddChannelModal}
          currentUserId={currentUserId}
        />
        <InvitePeopleModal
          open={openInvitePeopleModal}
          teamId={team.id}
          onClose={this.toggleInvitePeopleModal}
        />
        <DirectMessageModal
          open={openDirectMessageModal}
          teamId={team.id}
          onClose={this.toggleDirectMessageModal}
        />
      </React.Fragment>
    );
  }
}

export default Sidebar;
