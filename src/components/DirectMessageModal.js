import React from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';
import findIndex from 'lodash/findIndex';

import { GET_OR_CREATECHANNEL_MUTATION, ME_QUERY } from '../graphql/team';
import MultiSelectUsers from './MultiSelectUsers';

const DirectMessageModal = ({
  open,
  onClose,
  teamId,
  history,
  currentUserId,
  values,
  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>
Direct Messaging
    </Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <MultiSelectUsers
            value={values.members}
            handleChange={(e, { value }) => setFieldValue('members', value)}
            teamId={teamId}
            placeholder="select members to message"
            currentUserId={currentUserId}
          />
        </Form.Field>
        <Button
          disabled={isSubmitting}
          fluid
          onClick={e => {
            resetForm();
            onClose(e);
          }}
          type="button"
        >
          Cancel
        </Button>

        <Button disabled={isSubmitting} fluid onClick={handleSubmit} type="button">
          Start Messaging
        </Button>
      </Form>
    </Modal.Content>
  </Modal>
);

export default withRouter(({
  open, onClose, teamId, history, currentUserId
}) => (
  <Mutation mutation={GET_OR_CREATECHANNEL_MUTATION}>
    {getOrCreateChannel => (
      <Formik
        initialValues={{ members: [] }}
        onSubmit={async ({ members }, { resetForm }) => {
          await getOrCreateChannel({
            variables: {
              members,
              teamId
            },
            update: (store, { data: { getOrCreateChannel } }) => {
              const { id, name } = getOrCreateChannel;
              const data = store.readQuery({ query: ME_QUERY });
              const teamIdx = findIndex(data.me.teams, ['id', teamId]);

              const notInChannelList = data.me.teams[teamIdx].channels.every(c => c.id !== id);

              if (notInChannelList) {
                data.me.teams[teamIdx].channels.push({
                  __typename: 'Channel',
                  id,
                  name,
                  dm: true
                });
                store.writeQuery({ query: ME_QUERY, data });
              }
              history.push(`/view-team/${teamId}/${id}`);
              onClose();
              resetForm();
            }
          });
        }}
        render={formikProps => (
          <DirectMessageModal
            open={open}
            onClose={onClose}
            teamId={teamId}
            currentUserId={currentUserId}
            {...formikProps}
          />
        )}
      />
    )}
  </Mutation>
));
