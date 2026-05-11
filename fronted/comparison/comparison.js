document.addEventListener('DOMContentLoaded', () => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const savedParams = JSON.parse(localStorage.getItem('flightSearchParams') || "{}");
    
    let fromCity = urlParams.get('from') || savedParams.from;
    let toCity = urlParams.get('to') || savedParams.to;
    let departureDate = urlParams.get('depart') || savedParams.depart;
    const returnDate = urlParams.get('return') || savedParams.return;
    const tripType = urlParams.get('trip') || savedParams.trip;
    const passengers = urlParams.get('passengers') || savedParams.passengers || '1';

    // If parameters are missing (e.g., opened file directly), use default values
    if (!fromCity || !toCity || !departureDate) {
        fromCity = fromCity || "Kolkata";
        toCity = toCity || "Mumbai";
        // Default to tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        departureDate = departureDate || tomorrow.toISOString().split('T')[0];
    }

    // Common Indian Airport Codes
    const airportCodes = {
        "kolkata": "CCU",
        "mumbai": "BOM",
        "delhi": "DEL",
        "bangalore": "BLR",
        "bengaluru": "BLR",
        "chennai": "MAA",
        "hyderabad": "HYD",
        "pune": "PNQ",
        "goa": "GOI",
        "ahmedabad": "AMD",
        "jaipur": "JAI",
        "lucknow": "LKO",
        "patna": "PAT",
        "bhubaneswar": "BBI",
        "guwahati": "GAU"
    };

    function getAirportCode(city) {
        if (!city) return "";
        const lowerCity = city.toLowerCase().trim();
        return airportCodes[lowerCity] || lowerCity.toUpperCase().slice(0, 3);
    }

    const fromCode = getAirportCode(fromCity);
    const toCode = getAirportCode(toCity);

    // Format Date for Display
    const dDateObj = new Date(departureDate);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let displayDate = dDateObj.toLocaleDateString('en-US', options);
    
    let tripText = tripType === 'round' ? 'Round Trip' : 'One Way';
    let paxText = passengers + (passengers === '1' ? ' Passenger' : ' Passengers');

    // Capitalize city names for display
    const formatCity = (city) => city.charAt(0).toUpperCase() + city.slice(1);

    // Update UI Summary
    document.getElementById('route-title').textContent = `${formatCity(fromCity)} to ${formatCity(toCity)}`;
    
    if (tripType === 'round' && returnDate) {
        const rDateObj = new Date(returnDate);
        displayDate += ` - ${rDateObj.toLocaleDateString('en-US', options)}`;
    }
    
    document.getElementById('route-details').textContent = `${displayDate} • ${paxText} • ${tripText}`;

    // Date formatting for URLs
    const dDay = String(dDateObj.getDate()).padStart(2, '0');
    const dMonth = String(dDateObj.getMonth() + 1).padStart(2, '0');
    const dYear = dDateObj.getFullYear();
    const formattedDepDate = `${dDay}/${dMonth}/${dYear}`; // DD/MM/YYYY

    // MMT URL Construction
    let mmtUrl = `https://www.makemytrip.com/flight/search?itinerary=${fromCode}-${toCode}-${formattedDepDate}`;
    if (tripType === 'round' && returnDate) {
        const rDateObj = new Date(returnDate);
        const rDay = String(rDateObj.getDate()).padStart(2, '0');
        const rMonth = String(rDateObj.getMonth() + 1).padStart(2, '0');
        const rYear = rDateObj.getFullYear();
        const formattedRetDate = `${rDay}/${rMonth}/${rYear}`;
        mmtUrl = `https://www.makemytrip.com/flight/search?itinerary=${fromCode}-${toCode}-${formattedDepDate}_${toCode}-${fromCode}-${formattedRetDate}`;
    }
    mmtUrl += `&tripType=${tripType === 'round' ? 'R' : 'O'}&paxType=A-${passengers}_C-0_I-0&intl=false&cabinClass=E`;

    // Goibibo URL Construction
    const goiDepDate = `${dYear}${dMonth}${dDay}`; // YYYYMMDD
    let goiUrl = `https://www.goibibo.com/flights/air-${fromCode}-${toCode}-${goiDepDate}--${passengers}-0-0-E-D/`;

    // Mock Flight Data with different airlines
    let mockFlights = [
        { airline: 'Akasa Air', code: 'QP', flightNum: 'QP133', depTime: '06:15 AM', arrTime: '08:45 AM', duration: '2h30m', stops: 'Non-stop', price: 3850 },
        { airline: 'Air India Express', code: 'IX', flightNum: 'IX312', depTime: '08:00 AM', arrTime: '10:15 AM', duration: '2h15m', stops: 'Non-stop', price: 3900 },
        { airline: 'Vistara', code: 'UK', flightNum: 'UK263', depTime: '05:26 PM', arrTime: '07:46 PM', duration: '2h20m', stops: 'Non-stop', price: 4073 },
        { airline: 'SpiceJet', code: 'SG', flightNum: 'SG222', depTime: '11:39 PM', arrTime: '02:01 AM', duration: '2h22m', stops: 'Non-stop', price: 4221 },
        { airline: 'IndiGo', code: '6E', flightNum: '6E823', depTime: '09:22 PM', arrTime: '11:22 PM', duration: '2h00m', stops: 'Non-stop', price: 5142 },
        { airline: 'Air India', code: 'AI', flightNum: 'AI432', depTime: '10:00 AM', arrTime: '01:30 PM', duration: '3h30m', stops: '1 Stop', price: 5890 }
    ];

    // Sort prices low to high
    mockFlights.sort((a, b) => a.price - b.price);

    const flightsContainer = document.getElementById('flights-container');

    // Generate Flight Cards
    mockFlights.forEach(flight => {
        const card = document.createElement('div');
        card.className = 'flight-card';

        // Add some basic price variation based on passenger count just for display
        const totalPax = parseInt(passengers);
        const finalPrice = flight.price * totalPax;

        const mmtPrice = finalPrice;
        const goiPrice = finalPrice + 50;
        const skyPrice = finalPrice - 150;
        const gflightsPrice = finalPrice - 20;
        const ixigoPrice = finalPrice - 80;
        const paytmPrice = finalPrice + 120;

        card.innerHTML = `
            <div class="flight-info-row">
                <div class="airline-info">
                    <div class="airline-logo">${flight.code}</div>
                    <div class="airline-details">
                        <h4>${flight.airline}</h4>
                        <p>Flight ${flight.flightNum}</p>
                    </div>
                </div>

                <div class="time-section">
                    <div class="time-block">
                        <h3>${flight.depTime}</h3>
                        <p>${fromCode}</p>
                    </div>

                    <div class="duration-block">
                        <div class="dur-time">
                            <i data-feather="clock" style="width:12px;height:12px;"></i> ${flight.duration}
                        </div>
                        <div class="duration-line">
                            <i data-feather="navigation" style="width:12px;height:12px;transform:translate(-50%, -50%) rotate(45deg);"></i>
                        </div>
                        <div class="stops">${flight.stops}</div>
                    </div>

                    <div class="time-block">
                        <h3>${flight.arrTime}</h3>
                        <p>${toCode}</p>
                    </div>
                </div>

                <div class="price-section">
                    <h2>INR ${finalPrice.toLocaleString('en-IN')}</h2>
                    <p>per traveler</p>
                </div>
            </div>

            <div class="compare-row">
                <div class="compare-label">Compare & Book on:</div>
                <div class="ota-buttons">
                    <a href="${mmtUrl}" target="_blank" class="ota-btn">
                        <div class="ota-btn-header">MakeMyTrip <i data-feather="external-link"></i></div>
                        <div class="ota-btn-price">₹${mmtPrice.toLocaleString('en-IN')}</div>
                    </a>
                    <a href="${goiUrl}" target="_blank" class="ota-btn">
                        <div class="ota-btn-header">Goibibo <i data-feather="external-link"></i></div>
                        <div class="ota-btn-price">₹${goiPrice.toLocaleString('en-IN')}</div>
                    </a>
                    <a href="https://www.skyscanner.co.in/" target="_blank" class="ota-btn">
                        <div class="ota-btn-header">Skyscanner <i data-feather="external-link"></i></div>
                        <div class="ota-btn-price">₹${skyPrice.toLocaleString('en-IN')}</div>
                    </a>
                    <a href="https://www.google.com/travel/flights" target="_blank" class="ota-btn">
                        <div class="ota-btn-header">Google Flights <i data-feather="external-link"></i></div>
                        <div class="ota-btn-price">₹${gflightsPrice.toLocaleString('en-IN')}</div>
                    </a>
                    <a href="https://www.ixigo.com/" target="_blank" class="ota-btn">
                        <div class="ota-btn-header">Ixigo <i data-feather="external-link"></i></div>
                        <div class="ota-btn-price">₹${ixigoPrice.toLocaleString('en-IN')}</div>
                    </a>
                    <a href="https://paytm.com/flights" target="_blank" class="ota-btn">
                        <div class="ota-btn-header">Paytm <i data-feather="external-link"></i></div>
                        <div class="ota-btn-price">₹${paytmPrice.toLocaleString('en-IN')}</div>
                    </a>
                    <a href="#" class="book-btn">
                        Book via Airline <i data-feather="arrow-right"></i>
                    </a>
                </div>
            </div>
        `;

        flightsContainer.appendChild(card);
    });

});
