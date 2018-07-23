import React from 'react';
import {
  Button, Container, Form, Header, Input, Message
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REGISTER_USER = gql`
  mutation register($username: String!, $password: String!, $email: String!) {
    register(username: $username, password: $password, email: $email) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

class Register extends React.Component {
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: ''
  };

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      passwordError: '',
      emailError: ''
    });
    const { username, email, password } = this.state;
    const { registerUser, history } = this.props;
    const response = await registerUser({ variables: { username, email, password } });

    const { ok, errors } = response.data.register;

    if (ok) {
      history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.setState(err);
    }
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const {
      username, email, password, usernameError, passwordError, emailError
    } = this.state;

    const errorList = [usernameError, passwordError, emailError].filter(err => !!err);
    return (
      <Container text>
        <Header as="h2">
Register
        </Header>
        <Form>
          <Form.Field error={!!usernameError}>
            <Input
              name="username"
              onChange={this.onChange}
              value={username}
              placeholder="Username"
              fluid
            />
          </Form.Field>
          <Form.Field error={!!emailError}>
            <Input name="email" onChange={this.onChange} value={email} placeholder="Email" fluid />
          </Form.Field>

          <Form.Field error={!!passwordError}>
            <Input
              name="password"
              onChange={this.onChange}
              value={password}
              type="password"
              placeholder="Password"
              fluid
            />
          </Form.Field>
          <Button onClick={this.onSubmit}>
Submit
          </Button>
        </Form>
        {errorList.length > 0 && (
          <Message error header="There was some errors with your submission" list={errorList} />
        )}
      </Container>
    );
  }
}

export default ({ history }) => (
  <Mutation mutation={REGISTER_USER}>
    {registerUser => <Register registerUser={registerUser} history={history} />}
  </Mutation>
);
