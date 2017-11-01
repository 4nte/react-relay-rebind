export default {
  Mutation: {
    login: (_, { credentials }) => {
      const errors = { username: null, password: null };
      const { username, password } = credentials;
      if (username.length < 1) errors.username = 'username must not be empty.';
      if (!password.length) errors.password = 'password must not be empty.';
      return { errors };
    },
  },
};
