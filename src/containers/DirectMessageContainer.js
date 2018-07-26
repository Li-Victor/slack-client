import React from 'react';
import { Comment } from 'semantic-ui-react';
import { Query } from 'react-apollo';

import Messages from '../components/Messages';
import { DIRECTMESSAGES_QUERY, NEW_DIRECTMESSAGE_SUBSCRIPTION } from '../graphql/team';

class DirectMessageContainer extends React.Component {
  constructor(props) {
    super(props);
    const { subscribeToNewDirectMessages } = this.props;
    this.state = {
      unsubscribe: (() => subscribeToNewDirectMessages())()
    };
  }

  componentWillUnmount() {
    const { unsubscribe } = this.state;
    if (unsubscribe) {
      unsubscribe();
    }
  }

  render() {
    const { directMessages, teamId, userId } = this.props;
    return (
      <Messages key={[teamId, userId]}>
        <Comment.Group>
          {directMessages.map(m => (
            <Comment key={`${m.id}-direct-message`}>
              <Comment.Content>
                <Comment.Author as="a">
                  {m.sender.username}
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

export default ({ teamId, userId }) => (
  <Query query={DIRECTMESSAGES_QUERY} variables={{ teamId, userId }} fetchPolicy="network-only">
    {({
      loading, error, data, subscribeToMore, ...result
    }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      const { directMessages } = data;
      return (
        <DirectMessageContainer
          directMessages={directMessages}
          {...result}
          subscribeToNewDirectMessages={() => subscribeToMore({
            document: NEW_DIRECTMESSAGE_SUBSCRIPTION,
            variables: {
              teamId,
              userId
            },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev;
              const { newDirectMessage } = subscriptionData.data;
              return {
                ...prev,
                directMessages: [...prev.directMessages, newDirectMessage]
              };
            }
          })
          }
        />
      );
    }}
  </Query>
);
