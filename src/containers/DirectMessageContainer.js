import React from 'react';
import { Comment } from 'semantic-ui-react';
import { Query } from 'react-apollo';

import Messages from '../components/Messages';
import { DIRECTMESSAGES_QUERY } from '../graphql/team';

class DirectMessageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { directMessages } = this.props;
    return (
      <Messages>
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
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error! ${error.message}`;

      const { directMessages } = data;
      return <DirectMessageContainer directMessages={directMessages} />;
    }}
  </Query>
);
