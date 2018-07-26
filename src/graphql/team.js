import gql from 'graphql-tag';

export const ME_QUERY = gql`
  query me {
    me {
      id
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

export const CREATE_CHANNEL_MUTATION = gql`
  mutation createChannel($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

export const NEW_CHANNEL_SUBSCRIPTION = gql`
  subscription newChannelMessage($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;

export const MESSAGES_QUERY = gql`
  query messages($channelId: Int!) {
    messages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;

export const CREATE_TEAM_MUTATION = gql`
  mutation createTeam($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

export const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export const ALL_USERS_QUERY = gql`
  query allUsers {
    allUsers {
      id
      email
    }
  }
`;

export const LOGIN_USER_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export const REGISTER_USER_MUTATION = gql`
  mutation register($username: String!, $password: String!, $email: String!) {
    register(username: $username, password: $password, email: $email) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const ADD_TEAM_MEMBER_MUTATION = gql`
  mutation addTeamMember($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const CREATE_DIRECTMESSAGE_MUTATION = gql`
  mutation createDirectMessage($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

export const DIRECTMESSAGES_QUERY = gql`
  query directMessages($teamId: Int!, $userId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $userId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;

export const GET_TEAMMEMBERS_QUERY = gql`
  query getTeamMembers($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;

export const DIRECT_MESSAGE_ME_QUERY = gql`
  query directMessageMe($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
    me {
      id
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

export const NEW_DIRECTMESSAGE_SUBSCRIPTION = gql`
  subscription newDirectMessage($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;
