exports.up = async (sql) => {
  await sql`
    CREATE TABLE Users(
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      username varchar(80) NOT NULL,
      password_hash varchar(70) NOT NULL,
      email varchar(50) NOT NULL
    )
  `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE Users
  `;
};
