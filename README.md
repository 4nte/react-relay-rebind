# React Relay Rebind [![Travis][build-badge]][build] ![npm-version] [![Chat][discord]]([discord-invite])

_React relay rebind is a component-scope state management for Relay modern & React._

React-Relay-Rebind is a local state managment for React components which use Relay. Focus of React Relay Rebind is to handle data resolved with Relay mutations and provide it to a component. Component will recieve a state prop for each rebinded mutation. The API declaratively passes down state to components thus simplifying the data flow. The common usecase is non-persistent/local data (e.g UI state) which does not belong and does not deserve to be mixed with persistent data.

⚠️ **Warning: Do not use in production!** RRR is highly experimental, please stand by until 1.0.0 is released.

## Roadmap to production
- [ ] Automagically provide dispatch to commitMutation
- [ ] Simplify state configuration
- [ ] Subscribe to specific piece of state
- [ ] Optional state alias

## Installation
Yarn
```bash
$ yarn add react-relay-rebind
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
import { rebind } from 'react-relay-rebind';
import { loginMutation } from './loginMutation';

class MyComponent extends React.component {

  handleSubmit(){
    this.props.mutations.login(this.props.relay, this.state);
  }

  handleFieldChange(fieldName){
    return (e) => {
      // Login mutation stateProxy
      const { login } = this.props;

      this.setState({ [fieldName]: e.target.value() });

      // Set login mutation to initial state
      this.login.resetState();
    }
  }

  render(){
    const { errors } = this.props.login.state;
    const usernameClassname = errors.username ? 'has-error' : '';
    const passwordClassname = errors.password ? 'has-error' : '';

    return (
       <div>
        <input
          className={usernameClassname}
          name="username"
          type="text"
          onChange={this.handleFieldChange('username')}
          value={username} />
        <br/>
        <input
          className={passwordClassname}
          name="password"
          type="password"
          onChange={this.handleFieldChange('password')}
          value={password} />
        <br/>
        <input type="submit" onClick={this.handleSubmit} value="Login"/>
      </div>
  }
}

const mutations = {
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
export default rebind(mutations)(MyComponent);
```
## API Documentation

### Rebind
```javascript
rebind(mutations: mutationsConfiguration)(component: Component): Component
```
Binds mutations with a component. Composed component will recieve a [state proxy](#state-proxy) as a prop for each mutation specified in the [mutations configuration](#mutations-configuration).

### Mutations configuration
```javascript
    {
      mutationName : {
        mutation: function,
        initialState: <any>,
      }
    }
```
Mutations configuration object contains a property for each mutation binding. Property name be the same as the graphql's mutation name.
* **mutationName**: A graphql mutation name.
* <a name="mutation-function"></a> **mutation function**: A function called by the [mutation handler](#mutation-handlers) in a component. Mutation function will be provided with a [dispatch function](#dispatch) as the last argument. Mutation function could be a [commitMutation](#commit-mutation) or a function that calls `commitMutation` but then you must provide a `dispatch` to the `commitMutation` as the last argument.
* **initialState**: default mutation state.

### Commit mutation
```javascript
commitMutation(environment, config, dispatch)
```
Commits a mutation and dispatches resolved data to a binded component. This function is almost identical to the Relays `commitMutation` except that it expectes a [dispatch](#dispatch) function as a third argument.

### State proxy
```javascript
StateProxy {
  state,
  setState(state),
  resetState()
}
```
A state proxy is used to read & update a mutation state.
* <a name="mutation-state"></a> **state**: mutation state
* **setState()**: sets mutation state
* **resetState()**: sets mutation state to the initialState

### Mutation handlers
```javascript
props.mutations.mutationName
```
A binded component will recieve `mutations` prop which contains a mutation handler for each binded mutation.
Mutation handler is used to call the [mutation](#mutation-function) defined in the [mutation configuration](#mutation-configuration)

### dispatch
```javascript
dispatch(state)
```
A function that updates a mutation state and causes the component to recieve new [mutation state](#mutation-state)

## Contributing
Contributions are welcomed! It's suggested to create an issue beforehand to shed some light to others on what kind of change you are working on.
Fork, improve & create a pull request.

#### Development
Use `yarn run lint` to run a lint

Use `yarn run test:cover` to run tests

Please build locally before submitting a PR.

### Contributors
- [Ante Gulin](https://github.com/antegulin)

### Backers
<!--- ![ag04logo](http://ag04.com/site/wp-content/uploads/2012/07/ag-novi-logo.gif) -->






[npm-version]: https://img.shields.io/npm/v/react-relay-rebind.svg
[build-badge]: https://travis-ci.org/antegulin/react-relay-rebind.svg?branch=master
[build]: https://travis-ci.org/antegulin/react-relay-rebind
[discord]: https://img.shields.io/badge/chat-on%20discord-7289da.svg
[discord-invite]: https://discord.gg/EDwd5wr
