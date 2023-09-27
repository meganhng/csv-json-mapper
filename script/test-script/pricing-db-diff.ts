// const mongodb = require("mongodb");
import { MongoClient } from "mongodb";
import { diff } from "deep-object-diff";

/**
 * Steps:
 * - restore the PRD backup once
 * - rename the restored DB with a '-old' prefix
 * - restore the PRD backup again
 * = > 2 identical PRD backups
 *
 *
 * - run the migration with only a subset of audienceIds (something like 50)
 * - run this script to compare the 2 DBs and report (either console or on a local file) the differences when there are some
 */

// Function to consume messages
const run = async () => {
  console.log("Connecting to mongo")
  const cursorOld = await getMongoCursor(
    "mongodb://localhost:27017/ads-advertiser-campaigns",
    "pricings_old"
  );
  const cursorMigrated = await getMongoCursor(
    "mongodb://localhost:27017/ads-advertiser-campaigns",
    "pricings"
  );

  console.log("Successfully connected to mongo")

  let documentOld = await cursorOld.next();
  let documentMigrated = await cursorMigrated.next();
  let i = 0;
  let diffCount = 0;
  let noDiffCount = 0;

  console.log("Db diff running");
  while (documentOld) {
    
    const diffResult = compareDocuments(documentOld, documentMigrated);
    if (Object.keys(diffResult).length > 0) {
      diffCount ++;
      console.log(i, "diffResult", JSON.stringify(diffResult, null, 2));
    } else {
      noDiffCount++;
    }

    documentOld = await cursorOld.next();
    documentMigrated = await cursorMigrated.next();
    i++;
  }

  console.log(`Number of documents with no differences ${noDiffCount}`)
  console.log(`Number of documents with differences ${diffCount}`)

  process.exit();
};


const compareDocuments = (documentOld: any, documentMigrated: any) => {
  return  diff(documentOld, documentMigrated);
};

const getMongoCursor = async (url: string, collectionName: string) => {
  const client = await MongoClient.connect(url, {
    directConnection: true,
  });
  const db = client.db();
  const collection = db.collection(collectionName);
  const cursor = collection.find({}, { sort: { _id: 1 } });

  return cursor;
};

// Start the consumer
run().catch(console.error);
