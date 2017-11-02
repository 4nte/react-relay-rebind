# React Relay Rebind [![Travis][build-badge]][build] ![npm-version] [![Chat][discord]]([discord-invite])

_React relay rebind is a component-scope state management for Relay modern & React._

React-Relay-Rebind is a local state managment for React components which use Relay. Focus of React Relay Rebind is to handle data resolved with Relay mutations and provide it to a component. Component will recieve a state prop for each rebinded mutation. The API declaratively passes down state to components thus simplifying the data flow. The common usecase is non-persistent/local data (e.g UI state) which does not belong and does not deserve to be mixed with persistent data.

**Warning: Do not use in production!** RRR is highly experimental, please stand by until 1.0.0 is released. 

## Roadmap to production
- [ ] Automagically provide dispatch to commitMutation
- [ ] Simplify state configuration
- [ ] Subscribe to specific piece of state
- [ ] Optional state alias

## Installation
Yarn
```bash
$ npm install --save react-relay-rebind
```
 NPM
```bash
$ npm install --save react-relay-rebind
```
or build from source
```bash
$ git clone react-relay-rebind
$ cd react-relay-rebind && yarn install
$ yarn run build
```
## Usage
Provide dispatch to the commitMutation
```javascript
import { commitMutation } from 'react-relay-rebind';

const mutation = graphql`
  mutation LoginMutation($input: LoginInput!) {
    login(credentials: $input) {
      errors {
        username
        password
      }
    }
  }
`;

const loginMutation = (environment, input, dispatch) => { // dispatch is passed as the last argument
  commitMutation(
    environment,
    {
      mutation,
      variables: input,
    },
    dispatch // provide dispatch to the the commitMutation
  );
}

export default loginMutation;
```
Rebind mutations with the component
```JSX
import { commitMutation } from 'react-relay-rebind';
import { loginMutation } from './loginMutation';

class MyComponent extends React.component {

  handleSubmit(){
    this.props.mutations.login(this.props.relay, this.state);
  }
  
  render(){
    const { errors } = this.props.login;
    const usernameClassname = errors.username ? 'has-error' : '';
    const passwordClassname = errors.password ? 'has-error' : '';
    
    return (
       <div>
        <input 
          className={usernameClassname} 
          name="username" 
          type="text" 
          onChange={ e => this.setState({ username: e.target.value() }) } 
          value={username} />
        <br/>
        <input 
          className={passwordClassname} 
          name="password" 
          type="password" 
          onChange={ e => this.setState({ password: e.target.value() }) } 
          value={password} />
        <br/>
        <input type="submit" onClick={this.handleSubmit} value="Login"/>
      </div>
  }
}

const states = {
  login: {
    mutation: LoginMutation,
    initialState: {
      errors: {
        username: null,
        password: null,
      },
    },
  },
};
export default rebind(states)(MyComponent);
```
## Guide
#### `rebind(states)(component): Component`
When rebinding a component you must provide `states` that are to be binded with the `component`.
##### `states: Object`
Must contain a configuration object `{ mutation: <mutation function>, initialState: <any> }` for each mutation.
#### `commitMutation(environment, config, dispatch)`
Commits a mutation and dispatches resolved data as props to a component to whom mutation is rebinded to.



[npm-version]: https://img.shields.io/npm/v/react-relay-rebind.svg
[build-badge]: https://travis-ci.org/antegulin/react-relay-rebind.svg?branch=master
[build]: https://travis-ci.org/antegulin/react-relay-rebind
[discord]: https://img.shields.io/badge/chat-on%20discord-7289da.svg
[discord-invite]: https://discord.gg/EDwd5wr
