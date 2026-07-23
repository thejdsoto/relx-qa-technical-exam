const axios = require('axios');
const { expect } = require('chai');
const { url, headers, bookingPayload, } = require('../../data/booking.data');
const { createBooking, validateBooking } = require('../../helpers/api.helper');

describe('Create Booking API', () => {
    
    // Positive test case 
    it('should create a booking successfully', async () => {
        const response = await createBooking(url, bookingPayload, headers);
        const booking = response.data.booking;
        
        // HTTP status code assertion
        expect(response.status).to.equal(200);

        // Response body assertion
        expect(response.data).to.have.property('bookingid');
        expect(response.data).to.have.property('booking');
        expect(booking).to.have.property('firstname');
        expect(booking).to.have.property('lastname');
        expect(booking).to.have.property('totalprice');
        expect(booking).to.have.property('depositpaid');
        expect(booking).to.have.property('bookingdates');
        expect(booking).to.have.property('bookingdates').that.has.property('checkin');
        expect(booking).to.have.property('bookingdates').that.has.property('checkout');
        expect(booking).to.have.property('additionalneeds');

        // Response data type assertions
        expect(response.data.bookingid).to.be.a('number');
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
        await validateBooking(booking, bookingPayload); 
    });

    // Negative test cases
    it('should reject missing firstname', async () => {
        const invalidPayload = { ...bookingPayload };
        delete invalidPayload.firstname;

        try {
            await createBooking(url, invalidPayload, headers);

            throw new Error('Request should have failed');
        } catch (error) {
            expect(error.response.status).to.equal(500);
        }
    });

    it('should reject missing total price', async () => {
        const invalidPayload = { ...bookingPayload };
        delete invalidPayload.totalprice;

        try {
            await createBooking(url, invalidPayload, headers );

            throw new Error('Request should have failed');
        } catch (error) {
            expect(error.response.status).to.equal(500); //
            expect(error.response.data).to.equal('Internal Server Error');
            // NOTE: Ideally this API should return HTTP 400 for missing required fields.
            // Current implementation returns HTTP 500 with a generic error message.
        }
    });

    it('should convert invalid totalprice to null (current API behavior)', async () => {
        const invalidPayload = { ...bookingPayload };
        invalidPayload.totalprice = 'dog';

        const response = await createBooking(url, invalidPayload, headers);

        expect(response.status).to.equal(200);
        expect(response.data.booking.totalprice).to.equal(null); 
        // NOTE:
        // Ideally this API should return HTTP 400 for invalid data types.
        // Current implementation accepts the request and stores totalprice as null.
    });
});