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

///// HTML => show Model in dropdown based on selection of model
function showEVdataModel() {
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const mapModel = data.map((item) => {
            return (item.Model);
        });
        var select = document.getElementById("model");
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
showEVdataModel();

///// to be used in Map calculation
function showEVdataBattery() {
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const mapBattery = data.map((item) => {
            return (item.Battery_capacity_kWh);
        });
        console.log(mapBattery);
    });
}
showEVdataBattery();

///// to be used in Map calculation
function showEVdataRange() {
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const mapRange = data.map((item) => {
            return (item.Range_WLTP_km);
        });
        console.log(mapRange);
    });
}
showEVdataRange();

///// to be used in Map calculation
function showEVdataChargingPower() {
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const mapChargingPower = data.map((item) => {
            return (item.Maximum_DC_chargingPower_kW);
        });
        console.log(mapChargingPower);
    });
}
showEVdataChargingPower();

///// to be used in Map calculation
function showEVdataEnergyConsumption() {
    fetch('http://localhost:3000/cars').then(response => response.json()).then(data => {
        const mapEnergyConsumption = data.map((item) => {
            return (item.mean_EnergyConsumption_kWh_per_100km);
        });
        console.log(mapEnergyConsumption);
    });
}
showEVdataEnergyConsumption();





