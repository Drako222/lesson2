exports.up = async (sql) => {
  await sql`
  CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(90) NOT NULL,
    username varchar(30) NOT NULL UNIQUE
   )
 `;
};

// still missing uploaded image path

exports.down = async (sql) => {
  await sql`
    DROP TABLE users
  `;
};
