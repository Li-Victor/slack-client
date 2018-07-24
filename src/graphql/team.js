import gql from 'graphql-tag';

export const ALL_TEAMS = gql`
  query allTeams {
    allTeams {
      id
      name
      owner
      channels {
        id
        name
      }
    }
    inviteTeams {
      id
      name
      owner
      channels {
        id
        name
      }
    }
  }
`;
