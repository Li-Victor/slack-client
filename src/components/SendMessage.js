import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Formik } from 'formik';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const ENTER_KEY = 13;

const CREATE_MESSAGE = gql`
  mutation createMessage($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

const SendMessage = ({
  channelName,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <SendMessageWrapper>
    <Input
      onKeyDown={e => {
        if (e.keyCode === ENTER_KEY && !isSubmitting) {
          handleSubmit(e);
        }
      }}
      onChange={handleChange}
      onBlur={handleBlur}
      name="message"
      value={values.message}
      fluid
      placeholder={`Message # ${channelName}`}
    />
  </SendMessageWrapper>
);

export default ({ channelName, channelId }) => (
  <Mutation mutation={CREATE_MESSAGE}>
    {createMessage => (
      <Formik
        initialValues={{ message: '' }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          if (!values.message || !values.message.trim()) {
            setSubmitting(false);
            return;
          }

          await createMessage({
            variables: { channelId, text: values.message }
          });

          resetForm(false);
        }}
        render={({
          values, handleChange, handleBlur, handleSubmit, isSubmitting
        }) => (
          <SendMessage
            channelName={channelName}
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
