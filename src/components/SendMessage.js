import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { Formik } from 'formik';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const ENTER_KEY = 13;

const SendMessage = ({
  placeholder,
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
      placeholder={`Message # ${placeholder}`}
    />
  </SendMessageWrapper>
);

export default ({ onSubmit, placeholder }) => (
  <Formik
    initialValues={{ message: '' }}
    onSubmit={async (values, { setSubmitting, resetForm }) => {
      if (!values.message || !values.message.trim()) {
        setSubmitting(false);
        return;
      }

      await onSubmit(values.message);

      resetForm(false);
    }}
    render={({
      values, handleChange, handleBlur, handleSubmit, isSubmitting
    }) => (
      <SendMessage
        values={values}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        placeholder={placeholder}
      />
    )}
  />
);
