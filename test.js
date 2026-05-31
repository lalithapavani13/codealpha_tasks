const { MongoClient } = require("mongodb");

const uri = "mongodb://lalithapavani:pavani13@ac-7x5vm3m-shard-00-00.xyqld7e.mongodb.net:27017,ac-7x5vm3m-shard-00-01.xyqld7e.mongodb.net:27017,ac-7x5vm3m-shard-00-02.xyqld7e.mongodb.net:27017/?ssl=true&replicaSet=atlas-3xvmbq-shard-0&authSource=admin&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log(err);
  }
}

run();

