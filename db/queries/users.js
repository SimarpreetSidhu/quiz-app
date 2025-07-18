const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

const getUserById = (id) => {

  return db.query(`
    SELECT * FROM users
    WHERE users.id = $1;
    `, [id])
    .then(data => {
      console.log(`The user returned is `,data.rows[0]);
      return data.rows[0];
    })

}

module.exports = { getUsers, getUserById };
