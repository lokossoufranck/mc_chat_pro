/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

"use strict";
const DownloadMedia = require("./helper/DownloadMedia");
// import dependencies of mongoose
const mongoose = require("mongoose");
//const fs = require('fs');
const fs = require("fs-extra");
// import of model
const Inputmessage = require("./models/Inputmessages");
const Users = require("./models/Users");
const Discussions = require("./models/Discussions");
const Counters = require("./models/Counters");
// Connexion à la base de données mongoose
mongoose
  .connect(
    "mongodb+srv://user_cluster_1:uwQFgqq1rWZ1tMtm@cluster0.snwbn.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connexion à MongoDB réussie !");
  })
  .catch(() => {
    console.log("Connexion à MongoDB échouée !");
  });
// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json()); // creates express http server
const userRoutes = require('./routes/user');
// Sets server port and logs message on success

//app.listen(process.env.PORT || 1337,() => console.log("webhook is listening"));
const http = require('http');
const server = http.createServer(app);
//BEGIN SOCKET SRV
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', "POST"]
  }
});
//Définition globale de io
global.io = io;
io.on("connection", (socket) => {
  console.log('new client');
  socket.on("leaving", (data) => {
    console.log('leaving data data is', data)
  });
});

//END SOCKET SRV

// Accepts POST requests at /webhook endpoint
app.post("/webhook", async (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  // console.log('hello');

  // Check the Incoming webhook message

  //console.log(JSON.stringify(req.body, null, 2));
  // console.log(req.body.entry[0].changes[0].value.messages[0].timestamp);

  // console.log("MEDIA CONTACT");

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let message = req.body.entry[0].changes[0].value.messages[0];
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let temps = Number(
        req.body.entry[0].changes[0].value.messages[0].timestamp
      );
      var datetime = new Date(temps * 1000);
      if (req.body.entry[0].changes[0].value.contacts) {

        var lastInputMessage = await Inputmessage.find({
          wp_number_sender: from
        }).sort({ created_at: -1 }).limit(1);
        var discussion_id = 0;
        const discustion = await Discussions.aggregate(
          [
            {
              $lookup:
              {
                from: 'inputmessages',
                localField: '_id',
                foreignField: 'discussion_id',
                as: 'discussions'
              }
            },
            {
              "$match": {
                "is_open": true,
                "discussions.wp_number_sender": from
              }
            }

          ]);


        //console.log('dis_imsg',discustion[0]);
        // console.log('dis_imsg', discustion?.[0]?.discussions.length);

        var fistUserInQuee = await Users.find({
          'is_on_line': true
        }).sort({ lastdate_attribution: 1 }).limit(1);

        if (!fistUserInQuee) {
          fistUserInQuee = await Users.findOne({ username: 'mikah' });
        }

        if (discustion?.[0]?.discussions?.[0]?._id) {// it is an old discussion          
          discussion_id = discustion[0]._id
        } else {
          //it is a old discussion

          var new_disc = new Discussions({
            'id': 0,
            'is_open': true,
            'etat': 0, // new discussion
            'is_on_line': true,
            'created_at': new Date()
          });

          await new_disc.save()
            .then((d) => {
              discussion_id = d._id;
              console.log('...new d', d);
            }).catch((error) => {
              console.log(error);
            });
          fistUserInQuee.lastdate_attribution = new Date();
          const updateDoc = {
            $set: {
              lastdate_attribution: new Date()
            },
          };

          try {
            await Users.findByIdAndUpdate(fistUserInQuee[0]._id, {
              lastdate_attribution: new Date()
            });
          } catch (err) {
            console.log(err)
          }
          // await Users.updateOne({_id:fistUserInQuee._id},updateDoc, {upsert: true});  

          //  console.log("new",fistUserInQuee)

          // await Users.updateOne({_id:fistUserInQuee._id},updateDoc, {upsert: true});
          // console.log("old",fistUserInQuee)    
        }
        //console.log(lastInputMessage);
        // input message
        const inputmessage = new Inputmessage({
          id: temps,
          wp_number_sender: from,
          wp_number_receiver: "",
          discussion_id: discussion_id,
          user_id: fistUserInQuee[0]._id,
          contacts: req.body.entry[0].changes[0].value.contacts,
          created_at: datetime,
        });

        switch (message.type) {
          case "text":
            let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload 
            inputmessage.body = msg_body;
            inputmessage.type = 'text';
            break;
          case 'image':
            inputmessage.type = 'image';
            let image_id = message.image.id;
            //await DownloadMedia(image_id, "wp_" + image_id + ".jpg");
            const MediaIdPromise = new Promise((resolve, reject) => {
              var options = {
                'method': 'GET',
                'url': 'https://graph.facebook.com/v16.0/' + image_id + '/',
                'headers': {
                  'Authorization': 'Bearer ' + token,
                  'Content-Type': 'application/json'
                }
              };
              request(options, function (error, response) {
                if (error) throw new Error(error);
                resolve(JSON.parse(response.body));
                //console.log(JSON.parse(response.body).url);
              });
            });

            MediaIdPromise.then((data) => {
              console.log(data.url);
              var config = {
                method: 'get',
                responseType: 'stream',
                url: '' + data.url,
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              };

              axios(config)
                .then(function (response) {
                  response.data.pipe(fs.createWriteStream('storage/wp_' + image_id + '.jpg'))
                })
                .catch(function (error) {
                  console.log(error);
                });

            })
            break;
          case 'audio':
            inputmessage.type = 'audio';
            let audio_id = message.audio.id;
            const MediaIdPromise_audio = new Promise((resolve, reject) => {
              var options = {
                'method': 'GET',
                'url': 'https://graph.facebook.com/v16.0/' + audio_id + '/',
                'headers': {
                  'Authorization': 'Bearer ' + token,
                  'Content-Type': 'application/json'
                }
              };
              request(options, function (error, response) {
                if (error) throw new Error(error);
                resolve(JSON.parse(response.body));
              });
            });

            MediaIdPromise_audio.then((data) => {
              console.log(data.url);
              var config = {
                method: 'get',
                responseType: 'stream',
                //maxBodyLength: Infinity,
                url: '' + data.url,
                headers: {
                  'Authorization': 'Bearer ' + token
                }
              };

              axios(config)
                .then(function (response) {
                  response.data.pipe(fs.createWriteStream('storage/wp_' + audio_id + '.ogg'))
                })
                .catch(function (error) {
                  console.log(error);
                });

            })
            break;
          default:
            inputmessage.type = "text";
        }

        await inputmessage
          .save()
          .then(() => {



            // console.log(inputmessage)
          })
          .catch((error) => {
            console.log(error);
          });


      } else {
        // it is output message
      }

      /* ;*/

      /* ;*/
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
app.get('/client', function (req, res) {
  res.sendFile('client.html', { root: __dirname })
})
app.get("/", async (req, res) => {
  const discustion = await Discussions.aggregate(
    [
      {
        $lookup:
        {
          from: 'inputmessages',
          localField: '_id',
          foreignField: 'discussion_id',
          as: 'discussions'
        }
      },
      {
        "$match": {
          "is_open": true,
          "discussions.wp_number_sender": '22967200595'
        }
      }

    ]);

  res.status(200).send("Your are on webhook of whatsapp :" + process.env.PORT);
});

app.use('/api/mc_chat', userRoutes);
server.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));