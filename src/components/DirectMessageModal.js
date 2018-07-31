import React from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';

import { GET_OR_CREATECHANNEL_MUTATION } from '../graphql/team';
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
Add Channel
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
        >
          Cancel
        </Button>

        <Button disabled={isSubmitting} fluid onClick={handleSubmit}>
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
        onSubmit={async ({ members }, { setSubmitting }) => {
          const response = await getOrCreateChannel({
            variables: {
              members,
              teamId
            }
          });
          console.log(response);
          onClose();
          setSubmitting(false);
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
