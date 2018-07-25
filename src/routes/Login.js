import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Button, Container, Form, Header, Input, Message
} from 'semantic-ui-react';
import { Mutation } from 'react-apollo';

import { LOGIN_USER_MUTATION } from '../graphql/team';

const state = observable({
  email: '',
  password: '',
  errors: {}
});

const Login = observer(({ loginUser, history }) => {
  const {
    email,
    password,
    errors: { emailError, passwordError }
  } = state;
  const errorList = [passwordError, emailError].filter(err => !!err);

  const onSubmit = async () => {
    const response = await loginUser({
      variables: { email, password }
    });
    const {
      ok, token, refreshToken, errors
    } = response.data.login;
    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      state.errors = err;
    }
  };

  const onChange = e => {
    const { name, value } = e.target;
    state[name] = value;
  };

  return (
    <Container text>
      <Header as="h2">
Login
      </Header>
      <Form>
        <Form.Field error={!!state.errors.emailError}>
          <Input name="email" onChange={onChange} value={state.email} placeholder="Email" fluid />
        </Form.Field>
        <Form.Field error={!!state.errors.passwordError}>
          <Input
            name="password"
            onChange={onChange}
            value={state.password}
            type="password"
            placeholder="Password"
            fluid
          />
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
  <Mutation mutation={LOGIN_USER_MUTATION}>
    {loginUser => <Login loginUser={loginUser} history={history} />}
  </Mutation>
);
