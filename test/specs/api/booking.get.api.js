const axios = require('axios');
const { expect, assert } = require('chai');
const url = 'https://restful-booker.herokuapp.com/booking';
const bookingPayload = {
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
};
const headers = {
    'Accept': 'application/json'
};

describe('Get Booking API', () => {
    let bookingId;

    before(async () => {
        const createResponse = await axios.post(url, bookingPayload, { headers });  
        expect(createResponse.data.bookingid).to.be.a('number');
        bookingId = createResponse.data.bookingid;
    });

    it('should retrieve booking by id', async () => {
        const response = await axios.get(`${url}/${bookingId}`, { headers });
        const booking = response.data;

        // HTTP status code assertion
        expect(response.status).to.equal(200);

        // Response body assertion
        expect(booking).to.include.keys(
            'firstname',
            'lastname',
            'totalprice',
            'depositpaid',
            'bookingdates',
            'additionalneeds'
        );
        expect(booking.bookingdates).to.include.keys(
            'checkin',
            'checkout'
        );

        // Response data type assertions
        expect(booking).to.be.an('object');
        expect(booking.firstname).to.be.a('string');
        expect(booking.lastname).to.be.a('string');
        expect(booking.totalprice).to.be.a('number');
        expect(booking.depositpaid).to.be.a('boolean');
        expect(booking.bookingdates).to.be.an('object');
        expect(booking.bookingdates.checkin).to.not.be.NaN
        expect(booking.bookingdates.checkout).to.not.be.NaN
        expect(booking.additionalneeds).to.be.a('string');

        // Response data value assertions
        expect(booking.firstname).to.equal(bookingPayload.firstname);
        expect(booking.lastname).to.equal(bookingPayload.lastname);
        expect(booking.totalprice).to.equal(bookingPayload.totalprice);
        expect(booking.depositpaid).to.equal(bookingPayload.depositpaid);
        expect(booking.bookingdates.checkin).to.equal(bookingPayload.bookingdates.checkin);
        expect(booking.bookingdates.checkout).to.equal(bookingPayload.bookingdates.checkout);
        expect(booking.additionalneeds).to.equal(bookingPayload.additionalneeds);  
    });

    it('should return 404 for nonexistent booking', async() => {
        try {
            await axios.get(`${url}/999999991`, { headers });
        } catch (error) {
            expect(error.response.status).to.equal(404);
        }
    });
});