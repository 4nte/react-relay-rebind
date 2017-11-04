import React from 'react';
import stateProxyFactory from './stateProxy';

const connectComponent = (mutations) => (Component) => { // eslint-disable-line
  const mutationKeys = Object.keys(mutations); // Array of all mutation keys (names)

  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {};

      const composeMutation = (mutationKey, mutationFunction) => (...params) => {
        mutationFunction(...params, this.handleMutationResponseData(mutationKey));
      };

      // Compose all mutations
      this.composedMutations = {};
      this.mutationStateProxies = {};

      const StateProxy = stateProxyFactory(this);
      mutationKeys.forEach((mutationKey) => {
        const mutationFunction = mutations[mutationKey].mutation;
        const initialState = mutations[mutationKey].initialState;

        // Compose the mutation
        this.composedMutations[mutationKey] = composeMutation(mutationKey, mutationFunction);

        // Declare mutation state
        this.state[mutationKey] = initialState;

        // Create a mutation state proxy
        this.mutationStateProxies[mutationKey] = new StateProxy(mutationKey, initialState);
      });
    }

    setMutationState(mutationKey, data) {
      // Update component state
      this.setState({ [mutationKey]: data });

      // Update proxy state
      this.mutationStateProxies[mutationKey].state = data;
    }

    handleMutationResponseData(mutationKey) {
      return (response) => {
        const data = response[mutationKey];
        this.setMutationState(mutationKey, data);
      };
    }

    updateMutationProxies() {
      mutationKeys.forEach((mutationKey) => {
        this.mutationStateProxies[mutationKey].state = this.state[mutationKey];
      });
    }

    render() {
      const { props, composedMutations } = this;

      this.updateMutationProxies();
      return (<Component {...props} {...this.mutationStateProxies} mutations={composedMutations}/>);
    }
  };
};

export default connectComponent;
