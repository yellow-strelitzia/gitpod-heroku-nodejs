let port = process.env.PORT || 5000;

const moment = require('moment');
require('moment-timezone');
const fetch = require('node-fetch');
const express = require('express');
const app = express();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
}); 

app.get('/holiday.jpg', function(req, res,){
  res.sendFile(__dirname + '/holiday.jpg');
}); 

let pickupNextHoliday = async function(timezone, ipaddress) {
  moment.tz.setDefault(timezone);
  let datenow = moment();

  let getNextHolidayCore = async (year) => {
    // Web API , Geo loc
    const res2 = await fetch('http://free.ipwhois.io/json/'+ ipaddress);
    let geolocinfo = await res2.json();

    // Web API , Nager.date
    const res3 = await fetch('https://date.nager.at/api/v2/publicholidays/'+ 
        year + '/' + geolocinfo.country_code);
    let holidays = await res3.json();

    var nextholiday = null;
    for ( var holiday of holidays ) {
      let date = moment( holiday.date );
      if ( date.isAfter(datenow) || 
             ( date.isBefore(datenow) && date.diff(datenow, 'hours') > -24 )) {
        nextholiday = holiday;
        break;
      }
    }
    return nextholiday;
  }

  var target =  getNextHolidayCore( datenow.format('YYYY') );
  if ( target == null ) {
    target =  getNextHolidayCore( String(datenow.year() + 1) );
  }
  return target;
};

app.get('/nextholiday', function(req, res, next){
  let target = pickupNextHoliday(req.query.timezonename, req.query.ipaddress);

  target.then( (result) => {
    console.log( req.headers );
    console.log( 'found next holiday : ' + result.date + "  " + result.localName );
    res.json(result);    
  })
}); 

app.listen(port, () => console.log('Listening on port '+port));
