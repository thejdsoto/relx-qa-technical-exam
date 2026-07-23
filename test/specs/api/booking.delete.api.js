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
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

describe('Delete Booking API', () => {
    let token;
    let bookingId;

    beforeEach(async () => {
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