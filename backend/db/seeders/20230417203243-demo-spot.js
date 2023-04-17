'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '1133 Example Ave',
        city: 'Malibu',
        state: 'California',
        country: 'United States',
        lat: 47.60,
        lng: -122.33,
        name: 'BAYWATCH MALIBU',
        description: "Amazing 3-story home with panoramic views of ocean.",
        price: 350
      },
      {
        ownerId: 2,
        address: '2401 Commercial Ave',
        city: 'Las Vegas',
        state: 'Nevada',
        country: 'United States',
        lat: 36.16,
        lng: -86.78,
        name: 'Sin City Retreat',
        description: "Experience this once-in-lifetime vacation with this gorgeous loft surrounded by the bright lights of Vegas.",
        price: 155
      },
      {
        ownerId: 2,
        address: '1234 Spot Way',
        city: 'Denver',
        state: 'Colorado',
        country: 'United States',
        lat: 35.22,
        lng: -80.83,
        name: 'Denver Getaway',
        description: "Beautiful mountain retreat for the entire family.",
        price: 125
      },
      {
        ownerId: 3,
        address: '1234 Northside Drive',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        lat: 25.76,
        lng: -80.19,
        name: 'LA Vacation',
        description: "Experience this one of a kind penthouse in downton Los Angeles. Minutes away from so many famous attractions.",
        price: 300
      },
      {
        ownerId: 4,
        address: '123 Spot Dr.',
        city: 'San Diego',
        state: 'California',
        country: 'USA',
        lat: 32.7157,
        lng: 117.1611,
        name: 'Vacation Stay',
        description: 'Great vacation home for entire your entire family. Minutes from beach',
        price: 150.00
      },
      {
        ownerId: 4,
        address: '1234 Fly St.',
        city: 'Miami',
        state: 'Florida',
        country: 'United States',
        lat: 25.7617,
        lng: 80.1918,
        name: 'Diamond on Biscayne',
        description: "This luxurious penthouse suite is located right in downtown Miami on Ocean Dr and Biscayne Blvd. Views and nightlife like no other.",
        price: 699.99
      }
    ], {});

  },
  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      country: { [Op.in]: ['United States'] }
    }, {});
  }
};