import api from "./api";

export const loginUser = async ({ email, password }) => {
  const response = await api.get("/users", {
    params: {
      email: email.trim(),
      password,
    },
  });

  const users = Array.isArray(response.data) ? response.data : [];

  if (!users.length) {
    throw new Error("Invalid email or password.");
  }

  const user = users[0];

  return {
    token: `fake-token-${user.id}`,
    role: user.role,
    userId: user.id,
    email: user.email,
  };
};
