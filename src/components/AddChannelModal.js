import React from 'react';
import {
  Button, Form, Modal, Input
} from 'semantic-ui-react';
import { Formik } from 'formik';
import { Mutation } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import { ME_QUERY, CREATE_CHANNEL_MUTATION } from '../graphql/team';

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  resetForm
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

        <Form.Group widths="equal">
          <Button
            fluid
            disabled={isSubmitting}
            onClick={e => {
              resetForm();
              onClose(e);
            }}
            type="submit"
          >
            Cancel
          </Button>
          <Button fluid disabled={isSubmitting} onClick={handleSubmit} type="submit">
            Create Channel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

export default ({ open, onClose, teamId }) => (
  <Mutation mutation={CREATE_CHANNEL_MUTATION}>
    {createChannel => (
      <Formik
        initialValues={{
          name: ''
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await createChannel({
            variables: { teamId, name: values.name },
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
        render={formikProps => <AddChannelModal open={open} onClose={onClose} {...formikProps} />}
      />
    )}
  </Mutation>
);
