/////////////////////////-->getChargeStations();<--//////////////////////////
//the function requires 2 parameters: latitude and longitude, in that order//
//               example: getChargeStations(51.23074, 5.31349);            //
//                                                                         //
//                            suggested use:                               //
//      const exampleObject = getChargeStations(51.23074, 5.31349);        //
//                                                                         //
//      This will fill "exampleObject" with the following properties:      //
//                          "latitude" as an integer                       //
//                         "longitude" as an integer                       //
//                             "name" as a string                          //
//                           "cargeKW" as an integer                       //
//  "price": "Free text description of likely usage costs associated with  //
//this site. Generally relates to parking charges whether network operates //
//this site as Free" -> i guess as a string                                //
/////////////////////////////////////////////////////////////////////////////

//////////////////////////////////SETTINGS//////////////////////////////////
const apiKey = "2a1ce2b4-b597-4755-a4a3-d75b4cbe7ddb"; 
const baseUrl = "https://api.openchargemap.io/v3/poi";
const searchRadius = 20; //distance from the provided lati and longi to look for stations
const radiusUnit = "km"; //unit for the distance to look in (can be "km" or "miles")
const maxResults = 1; //amount of chargestations to return from the API (setting it to 1 only returns the nearest)
const enableDebug = true; //enables console logs if true
//////////////////////////////////SETTINGS END///////////////////////////////


async function getChargingStations(latitude, longitude) {
    var url = new URL(baseUrl); //create the API contact url and define it's parameters
    const params = [["latitude", latitude],
                    ["longitude", longitude],
                    ["distance", searchRadius], 
                    ["distanceunit", radiusUnit],
                    ["maxresults", maxResults]];
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

    //create object with only the necesary data and return it
    var bestStation = new Object();
        bestStation["name"] = data[0].AddressInfo.Title;
        bestStation["latitude"] = data[0].AddressInfo.Latitude;
        bestStation["longitude"] = data[0].AddressInfo.Longitude;
        bestStation["price"] = data[0].UsageCost;
        bestStation["chargeKW"] = data[0].Connections[0].PowerKW;
    if(enableDebug) console.log(bestStation);
    return bestStation;
}



function ocmTestCall() { //function to be deleted/commented later
    const chargeStop = getChargingStations(51.23074, 5.31349);
    console.log("testcall result:");
    console.log(chargeStop);
}
