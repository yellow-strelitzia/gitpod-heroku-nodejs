let port = process.env.PORT || 5000;

const moment = require('moment');
const fetch = require('node-fetch');
const express = require('express');
const app = express();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
}); 

app.get('/holiday.jpg', function(req, res,){
  res.sendFile(__dirname + '/holiday.jpg');
}); 

app.get('/nextholiday', function(req, res, next){
    let datenow = moment();

    let getNextHolidayCore = async (year) => {
      // Web API , Nager.date
      const res2 = await fetch('https://date.nager.at/api/v2/publicholidays/'+ year + '/JP');
      let holidays = await res2.json();

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

    (async function(){
      var target = await getNextHolidayCore( datenow.format('YYYY') );
      if ( target == null ) {
        target = await getNextHolidayCore( String(datenow.year() + 1) );
      }
      console.log(target);
      res.json(target);
    })();
}); 

app.listen(port, () => console.log('Listening on port '+port));
