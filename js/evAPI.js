///// show unique Make in dropdown
function showEVdataMake() {
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const mapMake = data.map((item) => {
            return (item.Make);
        });
        var uniqueMake = [...new Set(mapMake)]
        var select = document.getElementById("make");
        var options = uniqueMake;
        
        for(var i = 0; i < options.length; i++) {
            var opt = options[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
        console.log(uniqueMake)
    });
}
showEVdataMake();

// Remove all child elements from the DOM of the element passed as the first argument, el
// Also append a new child element with the textContent choose your model to maintain continuity
function removeAllChildrenAndClean(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
    let elem = document.createElement("option");
    elem.textContent = "Choose your Model";
    el.appendChild(elem);
    return;
}

///// HTML => show Model in dropdown based on selection of model
// Parameter: the make selected by the user
function showEVdataModel(make) {
    if (make === "Choose your Make") {
        var select = document.getElementById("model");
        removeAllChildrenAndClean(select);
        return;
    }
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        // First: filter the entire data based on the make, result is the filtered data
        const filteredData = data.filter((item) => {
            return item.Make === make;
        });
        // Second: map the parts of the filtered data that are of interest, 
        // result is a list containing all Models of the selected make
        const mapModel = filteredData.map((item) => {
            return (item.Model);
        });
        var select = document.getElementById("model");
        removeAllChildrenAndClean(select);
        var options = mapModel;
        
        for(var i = 0; i < options.length; i++) {
            var opt = options[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }
        console.log(mapModel)
    });
}

/* // Add event listener to the make selector 
// If the value is changed, i.e. the user has selected a value, 
// we call the function to fill in the models, corresponding to the selected make (which we ge pass along as a parameter)
// parameters are not allowed in event handlers, so we enclose this in an anonymous function
 */
document.getElementById("make").addEventListener("change", function() {
    showEVdataModel(document.getElementById("make").value);
});

//// Show Data based on selection Model
function showTotalEVData(model) {
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const filteredEVdata = data.filter((item) => {
            return item.Model === model;
        });
        const mapEVdata = filteredEVdata.map((item) => {
            const resultMap = {};
            resultMap["mean_EnergyConsumption_kWh_per_100km"] = item.mean_EnergyConsumption_kWh_per_100km;
            resultMap["Maximum_DC_chargingPower_kW"] = item.Maximum_DC_chargingPower_kW;
            //// resultMap["Range_WLTP_km"] = item.Range_WLTP_km; => incorrect values in API
            resultMap["Battery_capacity_kWh"] = item.Battery_capacity_kWh;
            sessionStorage.setItem('consumption', resultMap.mean_EnergyConsumption_kWh_per_100km);
            sessionStorage.setItem('chargingPower', resultMap.Maximum_DC_chargingPower_kW);
            sessionStorage.setItem('battery', resultMap.Battery_capacity_kWh);
            return resultMap;
        });
        console.log("EVdata",mapEVdata);

        /* calculateChargeTime(mapEVdata[0].Maximum_DC_chargingPower_kW, mapEVdata[0].mean_EnergyConsumption_kWh_per_100km)
        calculateChargePrice(mapEVdata[0].mean_EnergyConsumption_kWh_per_100km);
        /*calculateRangePercentage(mapEVdata[0].Battery_capacity_kWh, mapEVdata[0].mean_EnergyConsumption_kWh_per_100km);*/        
        /*calculateRange (mapEVdata[0].Battery_capacity_kWh, mapEVdata[0].mean_EnergyConsumption_kWh_per_100km);
        numberOfStops (mapEVdata[0].Battery_capacity_kWh, mapEVdata[0].mean_EnergyConsumption_kWh_per_100km); */
    });
}
document.getElementById("model").addEventListener("change", function() {
    showTotalEVData(document.getElementById("model").value);
});

/* //////////////////// Calculation ChargeTime
https://www.researchgate.net/post/How-to-count-the-charging-time-for-the-electric-vehicle
Equation (charge time demand=Vehicle Battery Capacity (KWH)/ Charging Station Delivery Rate (KW)).

* battery capacity to be loaded = (capacity*level)-((distance/100)*consumption)

=> battery capacity to be loaded / load power.
 */
function calculateChargeTime() {
    let carchargingPower = sessionStorage.getItem("chargingPower"); 
    let consumption = sessionStorage.getItem("consumption");
    let distance = sessionStorage.getItem("distance");

    ////pick smallest chargingPower => car vs chargePoint
    let chargingPower = (carchargingPower >= 22) ? 22 : carchargingPower; 
    ////calculate charging time (float)
    /* let temp = document.getElementById("batteryLevel").value;
    console.log("level",temp);
    let level = (100-temp)/100;
    let number = ((battery*level)+((distance/100)*consumption)) / chargingPower; */
    let number = ((distance/100)*consumption)/chargingPower;
    /////console.log("number",number);
    ////convert float to hh:mm
    let sign = (number >= 0) ? 1 : -1;
    number = number * sign;
    let hour = Math.floor(number);
    let decpart = number - hour;
    let min = 1 / 60;
    decpart = min * Math.round(decpart / min);
    let minute = Math.floor(decpart * 60) + '';
    if (minute.length < 2) {
    minute = '0' + minute; 
    }
    sign = sign == 1 ? '' : '-';
    chargeTime = sign + hour + ':' + minute;
    sessionStorage.setItem('chargeTime', {hour: hour, minute: minute});

    console.log("chargeTime",chargeTime);
    return chargeTime;
};
/* document.getElementById("batteryLevel").addEventListener("change", function() {
    showTotalEVData(document.getElementById("model").value);
}); */

////calculate chargetime to be used in Accordion
function calculateChargePrice () {
    let distance = sessionStorage.getItem("distance");
    let consumption = sessionStorage.getItem("consumption");
    let price = 0.26; // from ChargePrice API => NA because data is not clean
    /* let temp = document.getElementById("batteryLevel").value;
    let toFullBattery = battery*(100-temp)/100;
    ///console.log("extra",toFullBattery);
    let roundedPrice = Math.round((((((distance/100)*consumption)+toFullBattery)*price)+Number.EPSILON)*100)/100 +` €`; */
    let roundedPrice = Math.round(((((distance/100)*consumption)*price)+Number.EPSILON)*100)/100 +` €`;
    console.log("Price",roundedPrice);
    return roundedPrice;
};

/*///calculate Range based on percentage level & taking into account 
=> problem: consumption * (range/100) should be equal to capacity => not the case in API
=> solution: battery capacity/consumpion*100
=> percentage: solution*level/100
*/
/* function calculateRangePercentage (battery, consumption){
    let correctedRange = battery / consumption * 100;
    let temp = document.getElementById("batteryLevel").value;
    let rangePercentage = correctedRange*temp/100;
    console.log("levelRange",rangePercentage);
    return rangePercentage;
}; */

function calculateRange (){
    let consumption = sessionStorage.getItem("consumption");
    let battery = sessionStorage.getItem("battery");
    let correctedRange = Math.round(((battery / consumption * 100)+Number.EPSILON)*100)/100 +` km`;
    console.log("Range",correctedRange);
    return correctedRange
}

function numberOfStops (){
    let consumption = sessionStorage.getItem("consumption");
    let battery = sessionStorage.getItem("battery");
    let distance = sessionStorage.getItem("distance");
    let correctedRange = battery / consumption * 100;
    let numberOfStopsFloat = distance / correctedRange; 
    let numberOfStops = Math.floor(numberOfStopsFloat);
    console.log("numberOfStops",numberOfStops);
    return numberOfStops
}
function totalTravelTime () {
    calculateChargeTime();
    let chargingTimeTotal = sessionStorage.getItem("chargeTime");
    let travelTime =  sessionStorage.getItem("travelTime");
    let totalMinutes = chargingTimeTotal.minute + travelTime.minute;
    let totalHours = chargingTimeTotal.hour + travelTime.hour;
    if (totalMinutes / 60 > 1) {
        totalHours += Math.floor(totalMinutes / 60);
    }
    return {hour: totalHours, minute: totalMinutes};
}
    

    