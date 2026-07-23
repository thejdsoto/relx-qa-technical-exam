const url = 'https://restful-booker.herokuapp.com/booking';
const authURL = 'https://restful-booker.herokuapp.com/auth';

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

module.exports = {
    url,
    authURL,
    headers,
    bookingPayload,
    updatedPayload
}