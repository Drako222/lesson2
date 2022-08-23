import Link from 'next/link';
import queryGraphql from '../shared/query-graphql';

export default function Listing({ users, todos }) {
  return (
    <div>
      <h1>User Listing</h1>
      <ul>
        {users.map((user) => (
          <li key={user.username}>
            <Link href={`/user/${user.username}`}>
              <a>{user.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <h1>Todos Listing</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.title}>
            <Link href={`/todo/${todo.id}`}>
              <a>{todo.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const { users } = await queryGraphql(`
    query {
      users {
        name
        username
      }
    }
  `);

  const { todos } = await queryGraphql(`
  query {
    todos {
      title
      id
      checked
    }
  }
`);

  return { props: { users, todos } };
}
