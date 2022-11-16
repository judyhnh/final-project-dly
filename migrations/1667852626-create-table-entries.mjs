export async function up(sql) {
  await sql`
    CREATE TABLE entries (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      diary_content varchar(1500) NOT NULL,
      mood varchar(200) NOT NULL,
      date_entry varchar(50) NOT NULL,
      image_file varchar(255) UNIQUE


    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE entries
  `;
}
