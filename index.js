const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());

//welcome section
app.get('/', (req, res) => {
  res.send("<h1>Doctors Portal Server</h1>");
});

//post data section
app.post('/addServices', (req, res) => {
    const services = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect((error) => {
      const collection = client.db("doctorPortal").collection("services");
      collection.insert(services, (err, result) => {
        if (err) {
          console.log(err);
          console.log(error)
          res.status(500).send({ message: err });
        } else {
          res.send(result.ops[0]);
        }
      });
      client.close();
    });
});


app.post('/bookAppointment', (req, res) => {
  const appointmentDetails = req.body;
  appointmentDetails.bookingDate = new Date();
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("doctorPortal").collection("appointments");
    collection.insertOne(appointmentDetails, (err, result) => {
      if (err) {
        console.log(err);
        console.log(error)
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
    client.close();
  });
});

//put data section
app.put('/dailyAppointment/updateVisit', (req, res) => {
  const id = req.body.id
  client = new MongoClient(uri, { useNewUrlParser: true});
  client.connect((error) => {
    const collection = client.db("doctorPortal").collection("appointments");
    collection.updateOne({_id:ObjectId(id)}, {$set: {visited:true}}, (err, result) => {
      if (err) {
        console.log(err);
        console.log(error)
        res.status(500).send({ message: err });
      } 
    });
    client.close();
  });
});

app.put('/updatePrescription', (req, res) => {
  const id = req.body.id
  client = new MongoClient(uri, { useNewUrlParser: true});
  client.connect((error) => {
    const collection = client.db("doctorsPortal").collection("appointments");
    collection.updateOne({_id:ObjectId(id)}, {$set: {prescription:req.body.prescription}}, (err, result) => {
      if (err) {
        console.log(err);
        console.log(error)
        res.status(500).send({ message: err });
      } 
    });
    client.close();
  });
});

//get data section
app.get('/allAppointments', (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("doctorPortal").collection("appointments");
    collection.find().toArray((err, documents) => {
      if (err) {
        console.log(err);
        console.log(error)
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});


app.get('/dailyAppointment/:appointmentDate', (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("doctorPortal").collection("appointments");
    collection.find(req.params).toArray((err, documents) => {
      if (err) {
        console.log(err);
        console.log(error)
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});


app.get('/services', (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("doctorPortal").collection("services");
    collection.find().toArray((err, documents) => {
      if (err) {
        console.log(err);
        console.log(error)
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});


const port = process.env.PORT || 7000;
app.listen(port, (err) => {
    console.log("Listening song at port 7000",port);
});