import React from 'react';
import { Query } from 'react-apollo';
import { Button, Comment } from 'semantic-ui-react';

import { NEW_CHANNEL_SUBSCRIPTION, MESSAGES_QUERY } from '../graphql/team';
import Messages from '../components/Messages';

class MessageContainer extends React.Component {
  constructor(props) {
    super(props);
    const { subscribeToNewMessages } = this.props;
    this.state = {
      unsubscribe: (() => subscribeToNewMessages())(),
      hasMoreItems: true
    };
  }

  componentWillUnmount() {
    const { unsubscribe } = this.state;
    if (unsubscribe) {
      unsubscribe();
    }
  }

  render() {
    const { hasMoreItems } = this.state;
    const { messages, channelId, fetchMore } = this.props;
    return (
      <Messages key={channelId}>
        <Comment.Group>
          {hasMoreItems && (
            <Button
              onClick={() => {
                fetchMore({
                  variables: {
                    channelId,
                    offset: messages.length
                  },
                  updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                      return previousResult;
                    }
                    console.log(fetchMoreResult);

                    if (fetchMoreResult.messages.length < 5) {
                      this.setState({ hasMoreItems: false });
                    }

                    return {
                      ...previousResult,
                      messages: [...previousResult.messages, ...fetchMoreResult.messages]
                    };
                  }
                });
              }}
            >
              Load more
            </Button>
          )}
          {messages
            .slice()
            .reverse()
            .map(m => (
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
  <Query query={MESSAGES_QUERY} variables={{ channelId, offset: 0 }} fetchPolicy="network-only">
    {({
      loading, error, data, subscribeToMore, fetchMore
    }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      const { messages } = data;
      return (
        <MessageContainer
          messages={messages}
          channelId={channelId}
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
                messages: [newMessages, ...prev.messages]
              };
            }
          })
          }
          fetchMore={fetchMore}
        />
      );
    }}
  </Query>
);
