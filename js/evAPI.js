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


///// to be used in Accordion - charging calculation
function showEVdataBattery(model) {
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const filteredBattery = data.filter((item) => {
            return item.Model === model;
        });
        const mapBattery = filteredBattery.map((item) => {
            return (item.Battery_capacity_kWh);///
        });
    console.log(mapBattery);
});
}

document.getElementById("model").addEventListener("change", function() {
    showEVdataBattery(document.getElementById("model").value);
});

///// to be used in Map calculation
function showEVdataRange(model) {
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const filteredRange = data.filter((item) => {
            return item.Model === model;
        });
        const mapRange = filteredRange.map((item) => {
            return (item.Range_WLTP_km);
        });
    console.log(mapRange);
});
}

document.getElementById("model").addEventListener("change", function() {
    showEVdataRange(document.getElementById("model").value);
});

///// to be used in Accordion - charging calculation
function showEVdataChargingPower(model) {
fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const filteredChargingPower = data.filter((item) => {
            return item.Model === model;
        });
        const mapChargingPower = filteredChargingPower.map((item) => {
            return (item.Maximum_DC_chargingPower_kW);
        });
    console.log(mapChargingPower);
});
}

document.getElementById("model").addEventListener("change", function() {
    showEVdataChargingPower(document.getElementById("model").value);
});

///// to be used in Accordion - charging calculation
function showEVdataEnergyConsumption(model) {
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const filteredEnergyConsumption = data.filter((item) => {
            return item.Model === model;
        });
        const mapEnergyConsumption = filteredEnergyConsumption.map((item) => {
            return (item.mean_EnergyConsumption_kWh_per_100km);///
        });
        console.log(mapEnergyConsumption);
    });
}

document.getElementById("model").addEventListener("change", function() {
    showEVdataEnergyConsumption(document.getElementById("model").value);
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Alternative method, reduce amount of fetches by including all in one call

function showTotalEVData(model) {
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const filteredEnergyConsumption = data.filter((item) => {
            return item.Model === model;
        });
        const mapEnergyConsumption = filteredEnergyConsumption.map((item) => {
            const resultMap = {};
            resultMap["mean_EnergyConsumption_kWh_per_100km"] = item.mean_EnergyConsumption_kWh_per_100km;
            resultMap["Maximum_DC_chargingPower_kW"] = item.Maximum_DC_chargingPower_kW;
            resultMap["Range_WLTP_km"] = item.Range_WLTP_km;
            resultMap["Battery_capacity_kWh"] = item.Battery_capacity_kWh;
            return resultMap;
        });
        console.log(mapEnergyConsumption);
    });
}

document.getElementById("model").addEventListener("change", function() {
    showTotalEVData(document.getElementById("model").value);
});