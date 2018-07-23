import React from 'react';
import {
  Button, Form, Modal, Input
} from 'semantic-ui-react';
import { Formik } from 'formik';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const CREATE_CHANNEL = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name)
  }
`;

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <Modal open={open} onClose={onClose}>
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
          <Button fluid disabled={isSubmitting} onClick={onClose} type="submit">
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
  <Mutation mutation={CREATE_CHANNEL}>
    {createChannel => (
      <Formik
        initialValues={{
          name: ''
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await createChannel({ variables: { teamId, name: values.name } });
          onClose();
          setSubmitting(false);
        }}
        render={({
          values, handleChange, handleBlur, handleSubmit, isSubmitting
        }) => (
          <AddChannelModal
            open={open}
            onClose={onClose}
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      />
    )}
  </Mutation>
);
