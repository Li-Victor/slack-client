import React from 'react';
import {
  Button, Form, Modal, Input
} from 'semantic-ui-react';
import { Formik } from 'formik';
import { Mutation } from 'react-apollo';

import { ADD_TEAM_MEMBER_MUTATION } from '../graphql/team';
import normalizeErrors from '../normalizeErrors';

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
  <Mutation mutation={ADD_TEAM_MEMBER_MUTATION}>
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
            const errorsLength = errors.length;
            const filteredErrors = errors.filter(e => e.message !== 'user_id must be unique');
            if (errorsLength !== filteredErrors.length) {
              filteredErrors.push({
                path: 'email',
                message: 'this user is already part of the team'
              });
            }
            setErrors(normalizeErrors(filteredErrors));
          }
        }}
        render={formikProps => <AddChannelModal open={open} onClose={onClose} {...formikProps} />}
      />
    )}
  </Mutation>
);
