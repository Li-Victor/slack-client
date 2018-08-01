import React from 'react';
import { Query } from 'react-apollo';
import { Comment } from 'semantic-ui-react';

import { NEW_CHANNEL_SUBSCRIPTION, MESSAGES_QUERY } from '../graphql/team';

class MessageContainer extends React.Component {
  state = {
    hasMoreItems: true
  };

  componentWillMount() {
    const { channelId, subscribeToNewMessages } = this.props;
    this.unsubscribe = subscribeToNewMessages(channelId);
  }

  componentWillReceiveProps({ messages: nextPropMessages, channelId: nextPropsChannelId }) {
    const { channelId, messages, subscribeToNewMessages } = this.props;
    if (channelId !== nextPropsChannelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = subscribeToNewMessages(channelId);
    }

    if (
      this.scroller
      && this.scroller.scrollTop < 100
      && messages
      && nextPropMessages
      && messages.length !== nextPropMessages.length
    ) {
      // 35 items
      const heightBeforeRender = this.scroller.scrollHeight;
      // wait for 70 items to render
      setTimeout(() => {
        if (this.scroller) {
          this.scroller.scrollTop = this.scroller.scrollHeight - heightBeforeRender;
        }
      }, 120);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleScroll = () => {
    const { hasMoreItems } = this.state;
    const { fetchMore, channelId, messages } = this.props;

    if (this.scroller && this.scroller.scrollTop < 100 && hasMoreItems && messages.length >= 15) {
      fetchMore({
        variables: {
          channelId,
          cursor: messages[messages.length - 1].created_at
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          if (fetchMoreResult.messages.length < 15) {
            this.setState({ hasMoreItems: false });
          }

          return {
            ...previousResult,
            messages: [...previousResult.messages, ...fetchMoreResult.messages]
          };
        }
      });
    }
  };

  render() {
    const { messages } = this.props;
    return (
      <div
        style={{
          gridColumn: 3,
          gridRow: 2,
          paddingLeft: '20px',
          paddingRight: '20px',
          display: 'flex',
          flexDirection: 'column-reverse',
          overflowY: 'auto'
        }}
        onScroll={this.handleScroll}
        ref={scroller => {
          this.scroller = scroller;
        }}
      >
        <Comment.Group>
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
      </div>
    );
  }
}

export default ({ channelId }) => (
  <Query query={MESSAGES_QUERY} variables={{ channelId }} fetchPolicy="network-only">
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
