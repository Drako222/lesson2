import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro';

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(username: String): User
    todos: [Todo!]!
    todo(id: ID): Todo
  }
  type User {
    name: String
    username: String
  }
  type Todo {
    id: ID
    title: String
    status: Boolean
  }
`;
const users = [
  { name: 'Leeroy Jenkins', username: 'leeroy' },
  { name: 'Foo Bar', username: 'foobar' },
];

const todos = [
  { id: '1', title: 'Buy apples', status: false },
  { id: '2', title: 'Go home', status: true },
  { id: '3', title: 'Do sport', status: false },
];

const resolvers = {
  Query: {
    users() {
      return users;
    },
    user(parent, { username }) {
      return users.find((user) => user.username === username);
    },
    todos(parent, arg) {
      if(arg.status === true) {
        return todos.filter((todo) => arg.status === true)
      }
      else if (arg.status === false)
    },
    todo(parent, { id }) {
      return todos.find((todo) => todo.id === id);
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({ schema }).createHandler({
  path: '/api/graphql',
});
