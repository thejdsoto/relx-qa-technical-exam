const axios = require('axios');
const { expect } = require('chai');

async function createBooking(url, payload, headers) {
    return axios.post(url, payload, { headers });
}

async function validateBooking(actual, expected) {
    expect(actual.firstname).to.equal(expected.firstname);
    expect(actual.lastname).to.equal(expected.lastname);
    expect(actual.totalprice).to.equal(expected.totalprice);
    expect(actual.depositpaid).to.equal(expected.depositpaid);
    expect(actual.bookingdates.checkin).to.equal(expected.bookingdates.checkin);
    expect(actual.bookingdates.checkout).to.equal(expected.bookingdates.checkout);
    expect(actual.additionalneeds).to.equal(expected.additionalneeds);
}

module.exports = {
    createBooking,
    validateBooking
};