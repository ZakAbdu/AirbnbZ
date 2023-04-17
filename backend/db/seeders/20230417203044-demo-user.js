'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Demo',
        lastName: 'User',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'zakaria@user.io',
        username: 'ZakAbdu25',
        firstName: 'Zak',
        lastName: 'Abdu',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'joshn-smith@user.io',
        username: 'Smithers',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'yeezy@user.io',
        username: 'yeezy1',
        firstName: 'Kanye',
        lastName: 'West',
        hashedPassword: bcrypt.hashSync('password4')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'ZakAbdu25', 'yeezy1', 'FakeUser3'] }
    }, {});
  }
};