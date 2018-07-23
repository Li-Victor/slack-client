import gql from 'graphql-tag';

export const ALL_TEAMS = gql`
  query allTeams {
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
