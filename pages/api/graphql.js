import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro';

// it needs dotenv file
require('dotenv').config();
// I have a postgres database I'm gonna use
const postgres = require('postgres');
// I access with the help of this function
const sql = postgres();

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(username: String): User
    # it could be checked ! but then it would require user to add checked in the query
    todos(checked: Boolean): [Todo!]!
    todo(id: ID): Todo
  }
  type User {
    name: String
    username: String
  }
  type Todo {
    id: ID
    title: String
    checked: Boolean
  }
  type Mutation {
    createTodo(title: String!, checked: Boolean!): Todo
    createUser(username: String!, name: String!): User
  }
`;

// accessing data from PostgreSQL database without filter
const getTodos = async (checked) => {
  if (checked === true) {
    return await sql`SELECT * FROM todos WHERE checked = true`;
  }
  if (checked === false) {
    return await sql`SELECT * FROM todos WHERE checked = false`;
  }
  return await sql`SELECT * FROM todos`;
};

const getUsers = async () => {
  return await sql`SELECT * FROM users`;
};

// accessing specific user or todo
const getUser = async (username) => {
  const user = await sql`SELECT * FROM users WHERE username = ${username}`;
  return user[0];
};

const getTodo = async (id) => {
  const todo = await sql`SELECT * FROM todos WHERE id = ${id}`;
  return todo[0];
};

// creating new todo and user
const createTodo = async (title, checked) => {
  const res =
    await sql`INSERT INTO todos (title, checked) VALUES(${title}, ${checked}) RETURNING *`;
  return res[0];
};

const createUser = async (username, name) => {
  const res =
    await sql`INSERT INTO users (username, name) VALUES(${username}, ${name}) RETURNING *`;
  return res[0];
};

// resolvers for queries and mutations
const resolvers = {
  Query: {
    users() {
      return getUsers();
    },
    user(parent, args) {
      return getUser(args.username);
    },
    todos(parent, args) {
      return getTodos(args.checked);
    },
    todo(parent, args) {
      return getTodo(args.id);
    },
  },
  Mutation: {
    createTodo(parent, { title, checked }) {
      return createTodo(title, checked);
    },
    createUser(parent, { username, name }) {
      return createUser(username, name);
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
