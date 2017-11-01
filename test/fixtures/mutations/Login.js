import { graphql } from 'react-relay';

export default graphql`
  mutation LoginMutation($input: LoginInput!) {
    login(credentials: $input) {
      errors {
        username
        password
      }
    }
  }
`;
