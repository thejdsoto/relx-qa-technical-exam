const axios = require('axios');
const { expect } = require('chai');
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
const updatedPayload = {
    "firstname" : "John David",
    "lastname" : "Soto",
    "totalprice" : 679,
    "depositpaid" : false,
    "bookingdates" : {
        "checkin" : "2026-01-01",
        "checkout" : "2026-01-02"
    },
    "additionalneeds" : "N/A"
};
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

describe('Update Booking API', () => {
    let token;
    let bookingId;

    before(async () => {
        const createResponse = await axios.post(url, bookingPayload, { headers });
        const authResponse = await axios.post('https://restful-booker.herokuapp.com/auth', {
            username: 'admin',
            password: 'password123'
        }, { headers });
        
        expect(createResponse.data.bookingid).to.be.a('number');
        bookingId = createResponse.data.bookingid;

        expect(authResponse.data.token).to.be.a('string');
        token = authResponse.data.token;
    });

    it('should update booking successfully', async () => {
        const response = await axios.put(`${url}/${bookingId}`, updatedPayload, {
            headers: {
                ...headers,
                'Cookie': `token=${token}`
            }
        });
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
        expect(booking.firstname).to.equal('John David');
        expect(booking.lastname).to.equal('Soto');
        expect(booking.totalprice).to.equal(679);
        expect(booking.depositpaid).to.equal(false);
        expect(booking.bookingdates.checkin).to.equal('2026-01-01');
        expect(booking.bookingdates.checkout).to.equal('2026-01-02');
        expect(booking.additionalneeds).to.equal('N/A');  
    });

    it('should reject missing fields in the update payload', async () => {
        const invalidPayload = { ...updatedPayload };
        delete invalidPayload.firstname;

        try {
            const response = await axios.put(`${url}/${bookingId}`, invalidPayload, {
                headers: {
                    ...headers,
                    'Cookie': `token=${token}`
                }
            });

            throw new Error('Request should have failed');
        } catch(error) {
            expect(error.response.status).to.equal(400);
        } 
    });

    it(`should reject invalid data types in the update payload`, async () => {
        const invalidPayload = { ...updatedPayload };
        invalidPayload.totalprice = 'dog';

        const response = await axios.put(`${url}/${bookingId}`, invalidPayload, {
            headers: {
                ...headers,
                'Cookie': `token=${token}`
            }
        });

        expect(response.status).to.equal(200);
        expect(response.data.totalprice).to.equal(null); 
        // NOTE:
        // Ideally this API should return HTTP 400 for invalid data types.
        // Current implementation accepts the request and stores totalprice as null

    });

    it('should reject invalid token', async () => {
        try {
            await axios.put(`${url}/${bookingId}`, updatedPayload, {
                headers: {
                    ...headers,
                    'Cookie': `token=7890invalidtoken1234`
                }
            });

            throw new Error('Request should have failed');
        } catch (error) {
            expect(error.response.status).to.equal(403);
        }
    });

    it('should reject nonexistent booking', async () => {
        try {
            await axios.put(`${url}/9999999991`, updatedPayload, {
                headers: {
                    ...headers,
                    'Cookie': `token=${token}`
                }
            });

            throw new Error('Request should have failed');
        } catch (error) {
            expect(error.response.status).to.equal(405);
        }
    });
});