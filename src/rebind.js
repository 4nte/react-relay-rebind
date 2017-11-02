import React from 'react';

const connectComponent = (mutations) => (Component) => { // eslint-disable-line
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {};
      // this.handleMutationResponseData = this.handleMutationResponseData.bind(this);

      const composeMutation = (mutationKey, mutationFunction) => (...params) => {
        mutationFunction(...params, this.handleMutationResponseData(mutationKey));
      };

      // Array of all mutation keys (names)
      const mutationKeys = Object.keys(mutations);

      // Compose all mutations
      this.composedMutations = {};
      this.mutationStateProxies = {};

      for (let i = 0; i < mutationKeys.length; i += 1) {
        const key = mutationKeys[i];
        const mutationFunction = mutations[key].mutation;
        const initialState = mutations[key].initialState;

        // Compose the mutation
        this.composedMutations[key] = composeMutation(key, mutationFunction);

        // Declare mutation state
        this.state[key] = initialState;

        // Construct the mutation state proxy
        const setState = state => this.setState({ [key]: state });
        const state = this.state[key];
        this.mutationStateProxies[key] = { setState, state };
      }
    }

    handleMutationResponseData(mutationKey) {
      return (data) => {
        this.setState({ [mutationKey]: data[mutationKey] });
      };
    }

    render() {
      const { props, state, composedMutations } = this;
      return (<Component {...props} {...state} mutations={composedMutations}/>);
    }
  };
};

export default connectComponent;
