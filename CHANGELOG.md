# React-Relay-Rebind

## 0.1.0 (2017-11-4)

### Added
* #### StateProxy
  * **Feature:** set mutation state with `setState(<new state>)`.    
  * **Feature:** reset mutation state to initial state with `resetState()`.    
  * **Feature:** mutation state is accessible on `state`.    
* `yarn run dev` builds and links the npm package globally. This is useful for local development when you want import the package in another project to test it. To import it in another project you must do `yarn link react-relay-rebind` in the projects root directory. This will create a symlink to the npm package that you've just built with `yarn run dev`

### Breaking changes
- mutation state prop object is now changed to a stateProxy. To migrate to 0.1.0 append the mutation state identifier with a `state` property. Example: _v0.0.4_ `this.props.login.errors` -> _v0.1.0_ `this.props.login.state.errors`


## Improvements
* Replaced for loops with the `forEach`
