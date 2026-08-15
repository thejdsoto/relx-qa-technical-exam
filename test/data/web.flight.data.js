const flightDetails = {
    "origin": 'Manila',
    "destination": 'Boracay',
    "adult": 2,
    "child": 1,
    "infant": 0,
    "travelClass": 'Economy',
    "originCode": 'MNL',
    "destinationCode": 'MPH'
}

const errorMessages = {
    "origin": "Please enter a 'From' airport.",
    "destination": "Please enter a 'To' airport.",
    "departureDate": "Please enter a valid 'Depart' date.",
    "returnDate": "Please enter a valid 'Return' date."
}

module.exports = {
    flightDetails,
    errorMessages
}