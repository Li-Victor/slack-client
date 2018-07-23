import React from 'react';
import {
  Button, Form, Modal, Input
} from 'semantic-ui-react';
import { Formik } from 'formik';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import normalizeErrors from '../normalizeErrors';

const ADD_TEAM_MEMBER = gql`
  mutation addTeamMember($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  touched,
  errors
}) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>
Add People to your Team
    </Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="email"
            fluid
            placeholder="User's name"
          />
        </Form.Field>
        {touched.email && errors.email ? errors.email[0] : null}
        <Form.Group widths="equal">
          <Button fluid disabled={isSubmitting} onClick={onClose} type="submit">
            Cancel
          </Button>
          <Button fluid disabled={isSubmitting} onClick={handleSubmit} type="submit">
            Add User
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

export default ({ open, onClose, teamId }) => (
  <Mutation mutation={ADD_TEAM_MEMBER}>
    {addTeamMember => (
      <Formik
        initialValues={{
          email: ''
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          const response = await addTeamMember({ variables: { teamId, email: values.email } });
          const { ok, errors } = response.data.addTeamMember;
          if (ok) {
            onClose();
            setSubmitting(false);
          } else {
            setSubmitting(false);
            setErrors(normalizeErrors(errors));
          }
        }}
        render={({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          touched,
          errors
        }) => (
          <AddChannelModal
            open={open}
            onClose={onClose}
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            touched={touched}
            errors={errors}
          />
        )}
      />
    )}
  </Mutation>
);
