export async function up(sql) {
  await sql`
    CREATE TABLE entries (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      diary_entry varchar(500) NOT NULL,
      mood integer NOT NULL

    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE entries
  `;
}
