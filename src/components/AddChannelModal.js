import React from 'react';
import {
  Button, Checkbox, Form, Modal, Input
} from 'semantic-ui-react';
import { Formik } from 'formik';
import { Mutation } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import { ME_QUERY, CREATE_CHANNEL_MUTATION } from '../graphql/team';
import MultiSelectUsers from './MultiSelectUsers';

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  resetForm,
  teamId,
  setFieldValue,
  currentUserId
}) => (
  <Modal
    open={open}
    onClose={e => {
      resetForm();
      onClose(e);
    }}
  >
    <Modal.Header>
Add Channel
    </Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="name"
            fluid
            placeholder="Channel name"
          />
        </Form.Field>

        <Form.Field>
          <Checkbox
            checked={!values.public}
            label="Private"
            onChange={(e, { checked }) => setFieldValue('public', !checked)}
            toggle
          />
        </Form.Field>

        {!values.public && (
          <Form.Field>
            <MultiSelectUsers
              value={values.members}
              handleChange={(e, { value }) => setFieldValue('members', value)}
              teamId={teamId}
              placeholder="select members to invite"
              currentUserId={currentUserId}
            />
          </Form.Field>
        )}

        <Form.Group widths="equal">
          <Button
            fluid
            disabled={isSubmitting}
            onClick={e => {
              resetForm();
              onClose(e);
            }}
          >
            Cancel
          </Button>
          <Button fluid disabled={isSubmitting} onClick={handleSubmit}>
            Create Channel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

export default ({
  open, onClose, teamId, currentUserId
}) => (
  <Mutation mutation={CREATE_CHANNEL_MUTATION}>
    {createChannel => (
      <Formik
        initialValues={{
          name: '',
          public: true,
          members: []
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await createChannel({
            variables: {
              teamId,
              name: values.name,
              public: values.public,
              members: values.members
            },
            optimisticResponse: {
              createChannel: {
                __typename: 'Mutation',
                ok: true,
                channel: {
                  __typename: 'Channel',
                  id: -1,
                  name: values.name
                }
              }
            },
            update: (proxy, { data: { createChannel } }) => {
              const { ok, channel } = createChannel;
              if (!ok) {
                return;
              }

              const data = proxy.readQuery({ query: ME_QUERY });
              console.log(data);
              const teamIdx = findIndex(data.me.teams, ['id', teamId]);
              data.me.teams[teamIdx].channels.push(channel);
              proxy.writeQuery({ query: ME_QUERY, data });
            }
          });
          onClose();
          setSubmitting(false);
        }}
        render={formikProps => (
          <AddChannelModal
            open={open}
            onClose={onClose}
            {...formikProps}
            teamId={teamId}
            currentUserId={currentUserId}
          />
        )}
      />
    )}
  </Mutation>
);
