import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Button, Container, Form, Header, Input, Message
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const state = observable({
  name: '',
  errors: {}
});

const CREATE_TEAM = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

const CreateTeam = observer(({ createTeam, history }) => {
  const {
    name,
    errors: { nameError }
  } = state;
  const errorList = [nameError].filter(err => !!err);

  const onSubmit = async () => {
    let response = null;

    try {
      response = await createTeam({
        variables: { name }
      });
    } catch (err) {
      history.push('/login');
      return;
    }

    const { ok, errors, team } = response.data.createTeam;
    if (ok) {
      history.push(`/view-team/${team.id}`);
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      state.errors = err;
    }
  };

  const onChange = e => {
    state[e.target.name] = e.target.value;
  };

  return (
    <Container text>
      <Header as="h2">
Create a Team
      </Header>
      <Form>
        <Form.Field error={!!state.errors.emailError}>
          <Input name="name" onChange={onChange} value={state.name} placeholder="Name" fluid />
        </Form.Field>

        <Button onClick={onSubmit}>
Submit
        </Button>
      </Form>
      {errorList.length > 0 && (
        <Message error header="There was some errors with your submission" list={errorList} />
      )}
    </Container>
  );
});

export default ({ history }) => (
  <Mutation mutation={CREATE_TEAM}>
    {createTeam => <CreateTeam createTeam={createTeam} history={history} />}
  </Mutation>
);
