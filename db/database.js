const { Client } = require('pg');

const getDB = async () => {
  return new Client({
    connectionString: 'postgres://postgres:endencre@localhost:5432/postgres',
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
      'insert into bitcoin(timestamp,maindata) values($1,$2)',
      args
    );
    console.log('insterting into db');
    db.end();
    return rows;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {
  readData,
  writeData,
};
