export async function up(sql) {
  await sql`
    CREATE TABLE entries (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      diary_content varchar(500) NOT NULL,
      mood varchar(200) NOT NULL,
      date_entry varchar(50) NOT NULL

    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE entries
  `;
}
