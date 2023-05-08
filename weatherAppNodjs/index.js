const http = require('http');
const fs = require('fs');
const requests = require('requests')

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempval, orgVal)=>{

    let temperature = tempval.replace("{%tempval%}", orgVal.main.temp)
     temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min)
     temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max)
     temperature = temperature.replace("{%location%}", orgVal.name)
     temperature = temperature.replace("{%country%}", orgVal.sys.country)
    return temperature;
}

const server = http.createServer((req, res) => {

    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Churu&units=metric&appid=132495a4e57b2fa7bf2a95b7b63b9805")
            .on('data', (chunk) =>{
                const objData = JSON.parse(chunk)
                const arrData = [objData]
                // console.log(arrData[0].main.temp)

                const realTimeData = arrData.map(val=> replaceVal(homeFile,val)).join("");   
                res.write(realTimeData);
                // console.log(realTimeData)
            })
            .on('end',  (err)=> {
                if (err) return console.log('connection closed due to errors', err);

                // console.log('end');
                res.end()
            });

    }
});
server.listen(5000, "127.0.0.1");