const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceval = (tempVal, orgVal) => {
    let temprature = tempVal.replace("{%tempval%}", orgVal.main.temp - 273.15);
    temprature = temprature.replace("{%tempmin%}", orgVal.main.temp_min - 273.15);
    temprature = temprature.replace("{%tempmax%}", orgVal.main.temp_max - 273.15);
    temprature = temprature.replace("{%location%}", orgVal.name);
    temprature = temprature.replace("{%country%}", orgVal.sys.country);
    temprature = temprature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temprature;
}

const server = http.createServer((req, res) => {
    if (req.url = "/") {
        requests('http://api.openweathermap.org/data/2.5/weather?q=Surat&appid=4fdff40bdca43bf5be212adb854fec4a')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                //console.log(arrData[0].main.temp);
                const realTimeData = arrData.map(val => replaceval(homeFile, val)).join();
                res.write(realTimeData);
                //console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                //console.log('end');
            });
    } else {
        res.end();
    }
});
server.listen(1929, "127.0.0.1");