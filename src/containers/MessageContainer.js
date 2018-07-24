import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';

import Messages from '../components/Messages';

const NEW_CHANNEL_SUBSCRIPTION = gql`
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

class MessageContainer extends React.Component {
  constructor(props) {
    super(props);
    const { subscribeToNewMessages } = this.props;
    this.state = {
      unsubscribe: (() => subscribeToNewMessages())()
    };
  }

  componentWillUnmount() {
    const { unsubscribe } = this.state;
    if (unsubscribe) {
      unsubscribe();
    }
  }

  render() {
    const { messages, channelId } = this.props;
    return (
      <Messages key={channelId}>
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
Reply
                  </Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Messages>
    );
  }
}

export default ({ channelId }) => (
  <Query query={MESSAGES} variables={{ channelId }} fetchPolicy="network-only">
    {({
      loading, error, data, subscribeToMore, ...result
    }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      const { messages } = data;
      return (
        <MessageContainer
          messages={messages}
          channelId={channelId}
          {...result}
          subscribeToNewMessages={() => subscribeToMore({
            document: NEW_CHANNEL_SUBSCRIPTION,
            variables: {
              channelId
            },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev;
              const newMessages = subscriptionData.data.newChannelMessage;

              return {
                ...prev,
                messages: [...prev.messages, newMessages]
              };
            }
          })
          }
        />
      );
    }}
  </Query>
);
