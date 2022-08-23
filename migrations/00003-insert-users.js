const users = [
  {
    username: 'spielberg',
    name: 'Steven Spielberg',
  },
  {
    username: 'paul.atreides',
    name: 'Paul Atreides',
  },
];

exports.up = async (sql) => {
  await sql`
INSERT INTO users ${sql(users, 'username', 'name')}
 `;
};

exports.down = async (sql) => {
  for (const user of users) {
    await sql`
      DELETE FROM
        users
      WHERE
        username=${user.username}`;
  }
};
