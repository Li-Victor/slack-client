import React from 'react';
import {
  Button, Form, Modal, Dropdown
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

import { GET_TEAMMEMBERS_QUERY } from '../graphql/team';

const DirectMessageModal = ({
  open, onClose, teamId, history, getTeamMembers
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>
Add Channel
    </Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder="State"
            search={(items, inputValue) => items.filter(
              i => !inputValue || i.value.toLowerCase().includes(inputValue.toLowerCase())
            )
            }
            selection
            options={getTeamMembers.map(teamMember => ({
              ...teamMember,
              key: teamMember.id,
              text: teamMember.username,
              value: teamMember.id
            }))}
            onChange={(e, data) => {
              const userId = data.value;
              history.push(`/view-team/user/${teamId}/${userId}`);
              onClose();
            }}
          />
        </Form.Field>
        <Button fluid onClick={onClose}>
          Cancel
        </Button>
      </Form>
    </Modal.Content>
  </Modal>
);

export default withRouter(({
  open, onClose, teamId, history
}) => (
  <Query query={GET_TEAMMEMBERS_QUERY} variables={{ teamId }}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      const { getTeamMembers } = data;
      return (
        <DirectMessageModal
          open={open}
          onClose={onClose}
          teamId={teamId}
          getTeamMembers={getTeamMembers}
          history={history}
        />
      );
    }}
  </Query>
));
