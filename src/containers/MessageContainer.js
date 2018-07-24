import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';

import Messages from '../components/Messages';

const MESSAGES = gql`
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

const MessageContainer = ({ messages }) => (
  <Messages>
    <Comment.Group>
      {messages.map(m => (
        <Comment key={`${m.id}-message`}>
          <Comment.Content>
            <Comment.Author as="a">
              {m.user.username}
            </Comment.Author>
            <Comment.Metadata>
              <div>
                {m.created_at}
              </div>
            </Comment.Metadata>
            <Comment.Text>
              {m.text}
            </Comment.Text>
            <Comment.Actions>
              <Comment.Action>
Replay
              </Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      ))}
    </Comment.Group>
  </Messages>
);

export default ({ channelId }) => (
  <Query query={MESSAGES} variables={{ channelId }}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      const { messages } = data;
      return <MessageContainer messages={messages} />;
    }}
  </Query>
);
