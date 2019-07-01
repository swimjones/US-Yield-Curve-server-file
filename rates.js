/* Setting things up. */
var path = require('path'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    express = require('express'),
    app = express(),
    Twit = require('twit'),
    config = {
    /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */      
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    T = new Twit(config.twitter);

app.use(express.static('public'));

/* You can use cron-job.org, uptimerobot.com, or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */

app.all("/" + process.env.BOT_ENDPOINT, function (req, res) {
  request('https://www.treasury.gov/resource-center/data-chart-center/interest-rates/pages/textview.aspx?data=yield', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = null
      var $ = cheerio.load(html);
      var rate;
      $('.t-chart').filter(function(){
        var data = $(this).find('tr').last().children().text()
        //console.log(String(data))

        // select current date from data variable and save in current_date
        var current_date = data.slice(0,8)

        // remove current date from data variable
        var rates = data.substr(8)

        // split data variable every 3 characters, create new array
        var rates = rates.match(/.{1,4}/g)

        // create status update with interest rates
        var status_update = "1MO: " + rates[0] + '\n' + "2MO: " + rates[1] + '\n' + "3MO: " + rates[2] + '\n' + "6MO: " + rates[3] + '\n' + 
                            "1YR: " + rates[4] + '\n' + "2YR: " + rates[5] + '\n' + "3YR: " + rates[6] + '\n' + "5YR: " + rates[7] + '\n' + 
                            "7YR: " + rates[8] + '\n' + "10YR: " + rates[9] + '\n' + "20YR: " + rates[10] + '\n' + "30YR: " + rates[11]

        // save date and status updates in new variable
        var daily_update = current_date + '\n' + '\n' + status_update + '\n' + '\n' + "$ES $ZN $SPY $SHY $TLT $ITE $IEF" 

        // test to log new update
        console.log(daily_update)
      
        /* The example below tweets out "Hello world!". */
    T.post('statuses/update', { status: String(daily_update) }, function(err, data, response) {
    if (err){
      console.log('error!', err);
      res.sendStatus(500);
    }
    else{
      res.sendStatus(200);
    }
  });
  });
}});
  

});
  
var listener = app.listen(process.env.PORT, function () {
  console.log('Your bot is running on port ' + listener.address().port);
});

 //MAINTAINING BELOW CODE TO TROUBLESHOOT FORMATTING ISSUES... 

  request('https://www.treasury.gov/resource-center/data-chart-center/interest-rates/pages/textview.aspx?data=yield', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = null
      var $ = cheerio.load(html);
      var rate;
      $('.t-chart').filter(function(){
        var data = $(this).find('tr').last().children().text()
        console.log("STRING DATA: " + String(data))
        console.log('\n' + "CURRENT UPDATE: " + '\n')

        // select current date from data variable and save in current_date
        var current_date = data.slice(0,8)

        // remove current date from data variable
        var rates = data.substr(8)

        // split data variable every 3 characters, create new array
        var rates = rates.match(/.{1,4}/g)

        // create status update with interest rates
        var status_update = "1MO: " + rates[0] + '\n' + "2MO: " + rates[1] + '\n' + "3MO: " + rates[2] + '\n' + "6MO: " + rates[3] + '\n' + 
                            "1YR: " + rates[4] + '\n' + "2YR: " + rates[5] + '\n' + "3YR: " + rates[6] + '\n' + "5YR: " + rates[7] + '\n' + 
                            "7YR: " + rates[8] + '\n' + "10YR: " + rates[9] + '\n' + "20YR: " + rates[10] + '\n' + "30YR: " + rates[11]

        // save date and status updates in new variable
        var daily_update = current_date + '\n' + '\n' + status_update + '\n' + '\n' + "$ES $ZN $SPY $SHY $TLT $ITE $IEF" 

        // test to log new update
        console.log(daily_update)
        }
        )
      }
  })







