const express = require("express");
const router = express.Router();
const fs = require("fs");
const outputFile = "subscribers.json";


const readFile = () => {
    const subs = [];
    const result =  fs.readFileSync('subscribers.json');
    subs.push(...JSON.parse(result));
    console.log("result inside", subs );
    return subs;
}

const validateEmail = (email) => {
  if (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  } else {
    return false;
  }
};


router.get("/subscribe", async (req, res) => {
    const subscribeList = readFile();
    console.log("subscrribers", subscribeList);
    res.status(200).send({messge: "all subscriber", subscribeList });
    readFile();
  });

const exportToFile = (parsedResults) => {
    fs.writeFile(outputFile, JSON.stringify(parsedResults, null, 4), (err) => {
      if (err) {
        console.log(err);
      }
      console.log(outputFile);
    });
  };

router.post("/subscribe", async (req, res) => {

    const subscribeList = readFile();
  try {
        const {email} = req.body
    if (validateEmail(email)) {
        const {length} = subscribeList;
        const id = length + 1 ;
        const found = subscribeList.some(el => el.email === email)
        if(!found){
            subscribeList.push({
                id,
                email,
              });
              exportToFile(subscribeList);
             res.status(200).send({messge: "subscription successfully", subscribeList});
        }else{
            res.status(400).send({messge: "email already exist"});
        }
      
    }
  } catch (error) {
    res.status(400).send({error})
  }
});

module.exports = router;

router.post("/unsubscribe", async (req, res) => {
    const subscribeList = readFile();
    let subscribers=[];
    try {
        const {email} = req.body;
        console.log("email to unscribe", email);
      if (validateEmail(email)) {
        const found = subscribeList.some(el => el.email === email)
        console.log("found", found);
        if(found){
            subscribers = subscribeList.filter(el => el.email !== email);
            exportToFile(subscribers);
           res.status(200).send({message : "successfully unsubscribe",})
        }else{
            res.status(400).send({message : "we coudnt find you email in our list" })
        }
      }
    } catch (error) {
      res.status(400).send({error})
    }
  });