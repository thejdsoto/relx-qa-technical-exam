const axios = require('axios');
const { expect } = require('chai');
const { url, headers, bookingPayload, } = require('../../data/booking.data');
const { getToken } = require('../../helpers/auth.helper');
const { createBooking } = require('../../helpers/api.helper');

describe('Delete Booking API', () => {
    let token;
    let bookingId;

    beforeEach(async () => {
        const createResponse = await createBooking(url, bookingPayload, headers);
        expect(createResponse.data.bookingid).to.be.a('number');
        bookingId = createResponse.data.bookingid;

        token = await getToken(headers);
    });

    it('should delete booking', async () => {
        const response = await axios.delete(`${url}/${bookingId}`, {
            headers: {
                ...headers,
                'Cookie': `token=${token}`
            }
        });
        expect(response.status).to.equal(201);

        // Verify using GET method that booking is deleted
        try {
            await axios.get(`${url}/${bookingId}`, { headers }); 
        } catch (error) {
            expect(error.response.status).to.equal(404);
        }
    });
    
    it('should return error when deleting non existing booking', async () => { 
        try { 
            await axios.delete(`${url}/9999991`, { 
                headers: { 
                    ...headers, 
                    'Cookie': `token=${token}`
                } 
            })
        } catch (error) { 
            expect(error.response.status).to.equal(405); 
        } 
    });

    it('should reject invalid token', async () => { 
        try {
            await axios.delete(`${url}/${bookingId}`, {
                headers: {
                    ...headers,
                    'Cookie': `token=invalidtoken0009199`
                }
            }); 
        } catch (error) {
            expect(error.response.status).to.equal(403);     
        }
    });

    it('should return 405 on second delete', async () => { 
        // First delete
        const response = await axios.delete(`${url}/${bookingId}`, {
            headers: {
                ...headers,
                'Cookie': `token=${token}`
            }
        })
        expect(response.status).to.equal(201); // Verify first deletion is successful

        // Second delete
        try {
            await axios.delete(`${url}/${bookingId}`, {
                headers: {
                    ...headers,
                    'Cookie': `token=${token}`
                }
            });
        } catch (error) {
            expect(error.response.status).to.equal(405);     
        }    
    });
});