const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email?.trim()) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!password?.trim()) {
    errors.password = "Password is required.";
  }

  return errors;
};
