from psycopg import connect

conn = connect(
    host="localhost",
    port=5433,
    dbname="english_trainer",
    user="postgres",
    password="postgres",
)

print("CONNECTED")
conn.close()