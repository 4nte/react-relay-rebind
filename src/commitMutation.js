import {
  commitMutation as _commitMutation,
} from 'react-relay';

const commitMutation = (environment, config, dispatch) => {
  _commitMutation(
    environment,
    {
      ...config,
      onCompleted: (response, errors) => {
        if (config.onCompleted !== undefined) {
          config.onCompleted(response, errors);
        }
        dispatch(response);
      },
      onError: err => console.error(err),

    },
  );
};

export default commitMutation;
