const axios = require('axios');

async function getToken(headers) {
    const response = await axios.post(
        'https://restful-booker.herokuapp.com/auth',
        {
            username: 'admin',
            password: 'password123'
        },
        { headers }
    );

    return response.data.token;
}

module.exports = {
    getToken
};