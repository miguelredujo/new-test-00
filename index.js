const express = require("express");
const app = express();
const PORT = 3001;

const fs = require("fs");
const path = require("path");
const { send } = require("process");
const pathFile = path.resolve("./data.json");

app.use(express.json());
/*
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
*/

const getResources = () => JSON.parse(fs.readFileSync(pathFile));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api/activeresource", (req, res) => {
  const resources = getResources();
  const activeResource = resources.find((r) => r.status === "active");
  res.send(activeResource);
});

app.get("/api/resources", (req, res) => {
  const resources = getResources();
  res.send(resources);
});

app.get("/api/resources/:id", (req, res) => {
  const resources = getResources();
  const { id } = req.params;
  const resource = resources.find((r) => r.id === id);
  res.send(resource);
});

app.patch("/api/resources/:id", (req, res) => {
  const resources = getResources();
  const { id } = req.params;
  const index = resources.findIndex((r) => r.id === id);
  const activeResource = resources.find((r) => r.status === "active");

  if (resources[index].status === "complete") {
    return res.status(422).send("there is active resource already");
  }
  resources[index] = req.body;

  // active resource related functionality
  if (req.body.status === "active") {
    if (activeResource)
      return res.status(422).send("There is active resource already");
    resources[index].status = "active";
    resources[index].activationTime = new Date();
  }

  fs.writeFile(pathFile, JSON.stringify(resources, null, 2), (error) => {
    if (error) res.status(422).send("Cannot store data in the file!");
    res.send("recevied");
  });
});

app.post("/api/resources", (req, res) => {
  const resources = getResources();

  resource = req.body;
  resource.createAt = new Date();
  resource.status = "inactive";
  resource.id = Date.now().toString();
  resources.unshift(resource);

  fs.writeFile(pathFile, JSON.stringify(resources, null, 2), (error) => {
    if (error) res.status(422).send("Cannot store data in the file!");
    res.send("recevied");
  });
});

app.patch("/api/resources/:id", (req, res) => {
  const resources = getResources();
  const { id } = req.params;
  const index = resources.findIndex((r) => r.id === id);

  resources[index] = req.body;

  fs.writeFile(pathFile, JSON.stringify(resources, null, 2), (error) => {
    if (error) res.status(422).send("Cannot store data in the file!");
    res.send("recevied");
  });
});

app.listen(PORT, () => {
  console.log("Server is listening on port:", PORT);
});
