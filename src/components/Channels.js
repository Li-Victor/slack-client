import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
`;

const TeamNameHeader = styled.h1`
  color: #fff;
  font-size: 20px;
`;

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const paddingLeft = 'padding-left: 10px';

const SideBarListItem = styled.li`
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;

const SideBarListHeader = styled.li`
  ${paddingLeft};
`;

const PushLeft = styled.div`
  ${paddingLeft};
`;

const Green = styled.span`
  color: #38978d;
`;

const Bubble = ({ on = true }) => (on ? (
  <Green>
●
  </Green>
) : '○');

const channel = ({ id, name }, teamId) => (
  <Link to={`/view-team/${teamId}/${id}`} key={`channel-${id}`}>
    <SideBarListItem>
      #&#160;
      {name}
    </SideBarListItem>
  </Link>
);

const dmChannel = ({ id, name }, teamId) => (
  <SideBarListItem key={`user-${id}`}>
    <Link to={`/view-team/${teamId}/${id}`}>
      <Bubble />
      {' '}
      {name}
    </Link>
  </SideBarListItem>
);

export default ({
  teamName,
  username,
  channels,
  dmChannels,
  onAddChannelClick,
  teamId,
  onInvitePeopleClick,
  isOwner,
  onDirectMessageCick
}) => (
  <ChannelWrapper>
    <PushLeft>
      <TeamNameHeader>
        {teamName}
      </TeamNameHeader>
      {username}
    </PushLeft>

    <React.Fragment>
      <SideBarList>
        <SideBarListHeader>
          Channels
          {' '}
          {isOwner && <Icon name="add circle" onClick={onAddChannelClick} />}
        </SideBarListHeader>
        {channels.map(c => channel(c, teamId))}
      </SideBarList>
    </React.Fragment>

    <React.Fragment>
      <SideBarList>
        <SideBarListHeader>
          Direct Messages
          {' '}
          <Icon name="add circle" onClick={onDirectMessageCick} />
        </SideBarListHeader>
        {dmChannels.map(dmC => dmChannel(dmC, teamId))}
      </SideBarList>
    </React.Fragment>

    <React.Fragment>
      {isOwner && (
        <a href="#invite-people" onClick={onInvitePeopleClick}>
          + Invite People
        </a>
      )}
    </React.Fragment>
  </ChannelWrapper>
);
