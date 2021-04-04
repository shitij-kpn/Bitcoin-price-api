const { Client } = require('pg');

const getDB = async () => {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
};

const readData = async () => {
  try {
    const db = await getDB();
    await db.connect();
    const { rows } = await db.query(
      'SELECT * FROM bitcoin ORDER BY id DESC LIMIT 1'
    );
    db.end();
    console.log(rows);
    return rows[0];
  } catch (error) {
    console.log(error);
    return {
      message: error,
    };
  }
};

const writeData = async (...args) => {
  try {
    const db = await getDB();
    await db.connect();
    const { rows } = await db.query(
      'insert into bitcoin(timestamp,maindata,metadata) values($1,$2,$3)',
      args
    );
    console.log('inserting into db');
    db.end();
    return rows;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const readAllData = async () => {
  try {
    const db = await getDB();
    await db.connect();
    const { rows } = await db.query('SELECT * FROM bitcoin ORDER BY id DESC');
    db.end();
    return rows;
  } catch (error) {
    console.log(error);
    return {
      message: error,
    };
  }
};

module.exports = {
  readData,
  writeData,
  readAllData,
};
