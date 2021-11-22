//////////////////////////////////SETTINGS//////////////////////////////////
const apiKey = "2a1ce2b4-b597-4755-a4a3-d75b4cbe7ddb"; 
const baseUrl = "https://api.openchargemap.io/v3/poi";
const maxResults = 100; //amount of chargestations to return from the API (setting it to 1 only returns the nearest)
const enableDebug = true; //enables console logs if true
//////////////////////////////////SETTINGS END///////////////////////////////


async function asyncGetChargingStations(latitudeA, longitudeA, latitudeB, longitudeB) {
    var url = new URL(baseUrl); //create the API contact url and define it's parameters
    const boundingBox = "(" + latitudeA + "," + longitudeA + ")(" + latitudeB + "," + longitudeB + ")";
    const params = [["boundingbox", boundingBox],
                    ["maxresults", maxResults]]

    /* var searchParams = new URLSearchParams(params);
    const searchParamString = searchParams.toString();
    url.search = searchParamString; */
    //merge the parameters with the URL (old code up top)
    url.search = new URLSearchParams(params).toString();
    if(enableDebug) console.log(url.toString());

    //contact the API and extract the returned json
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-API-key": apiKey
        }
    });
    const data = await response.json();
    if(enableDebug) console.log(data);

    var stationArray = [];
    data.forEach(function (item, index) {
        var station = {};
        station.latitude = data[index].AddressInfo.Latitude;
        station.longitude = data[index].AddressInfo.Longitude;
        station.name = data[index].AddressInfo.Title;

        stationArray.push(station);
    });
    if(enableDebug) console.log(stationArray);
    return stationArray;

}



//dont remove need for reference to call this shit because else you get a ton of bs errors and shit
async function ocmTestCall() { //function to be deleted/commented later
    const chargeStop = await asyncGetChargingStations(51.23074, 5.31349, 48.864716, 2.349014);
    console.log("testcall result:");
    console.log(chargeStop);
    console.log(chargeStop[5].name);
}

