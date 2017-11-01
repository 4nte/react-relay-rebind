import chai from 'chai';
import spies from 'chai-spies';
import { Network } from 'relay-local-schema';
import { Environment, RecordSource, Store } from 'relay-runtime';
import { makeExecutableSchema } from 'graphql-tools';
import commitMutation from '../src/commitMutation';
import typeDefs from './fixtures/schema';
import resolvers from './fixtures/resolvers';
import LoginMutation from './fixtures/mutations/Login';

chai.use(spies);
const expect = chai.expect;

// Graphql schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Relay environment
const source = new RecordSource();
const store = new Store(source);
const environment = new Environment({
  network: Network.create({ schema }),
  store,
});

// Mutation input
const variables = {
  input: { username: '', password: 'secret' },
};

// Mutation expected response
const expectedResponse = {
  login: {
    errors: {
      username: 'username must not be empty.',
      password: null,
    },
  },
};

// Mock dispatch function
const dispatch = () => null;

describe('commitMutation', () => {
  it('should call dispatch with correct mutation\'s response data', (done) => {
    const dispatchSpy = chai.spy.on(dispatch, 'dispatch');
    commitMutation(
      environment,
      { mutation: LoginMutation, variables },
      dispatchSpy,
    );

    setTimeout(() => {
      expect(dispatchSpy).to.have.been.called.with(expectedResponse);
      done();
    }, 0);
  });
});
