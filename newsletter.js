const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));



app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/newsletter.html');
})

app.post('/',(req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    // here we will post the data so use request() instead of https.get()
    // for more details should visit on docs of express
    const url = "https://us10.api.mailchimp.com/3.0/lists/fb6a56ff11";
    const options = {
        method: 'POST',
        auth: 'vishal:d24267519a4257894148a3fe9f3879e5-us10'
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode===200){
            // res.send("woah ! you have subscribed");
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        // response.on("data", function(data){
        //     console.log(JSON.parse(data));
        // })
    });

    request.write(jsonData);
    request.end();
})

// on failure redirect onto home url
app.post('/failure',function(req,res){
    res.redirect('/');
})


app.listen(3000,()=>{
    console.log("app is listing on port 3000");    
})
// d24267519a4257894148a3fe9f3879e5-us10
// uid
// fb6a56ff11