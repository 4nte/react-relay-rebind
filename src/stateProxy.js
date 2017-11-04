export default function stateProxyFactory(component) {
  return function createStateProxy(mutationkey, initialState) {
    // set mutation state
    const setState = newState => component.setState({ [mutationkey]: newState });

    // set state to initial value
    const resetState = () => setState(initialState);

    // mutation resolved state
    this.state = component.state[mutationkey];

    // State proxy object
    return {
      state: this.state,
      setState,
      resetState,
    };
  };
}
