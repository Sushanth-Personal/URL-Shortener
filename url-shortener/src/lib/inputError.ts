// src/lib/inputError.ts
export const validateEmail = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const error = emailPattern.test(email) ? '' : 'Please enter a valid email address.';
  return { value: email, error };
};

export const validatePassword = (password: string) => {
  const error = password.length >= 8 ? '' : 'Password must be at least 8 characters long.';
  return { value: password, error };
};

export const validateContact = (contact: string) => {
  const contactPattern = /^[0-9]{10}$/;
  const error = contactPattern.test(contact) ? '' : 'Please enter a valid 10-digit phone number.';
  return { value: contact, error };
};