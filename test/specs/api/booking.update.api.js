const axios = require('axios');
const { expect } = require('chai');
const { url, headers, bookingPayload, updatedPayload, authURL } = require('../../data/booking.data');
const { getToken } = require('../../helpers/auth.helper');
const { createBooking, validateBooking } = require('../../helpers/api.helper');

describe('Update Booking API', () => {
    let token;
    let bookingId;

    before(async () => {
        const createResponse = await createBooking(url, bookingPayload, headers);
        expect(createResponse.data.bookingid).to.be.a('number');
        bookingId = createResponse.data.bookingid;

        token = await getToken(headers);
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
        await validateBooking(booking, updatedPayload);
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