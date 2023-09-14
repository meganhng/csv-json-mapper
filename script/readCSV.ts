import fs from 'fs';
import {parse} from 'csv-parse';

let formattedData = {}

/**
Org ID
Campaign ID
Campaign Set ID
GEO
Current Max Bid value
Target Max Bid value (from csv file?)
 */

fs.createReadStream("./migration_data.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    const [organizationId, campaignId, campaignSetId, country, currMaxBid, targetMaxBid] = row;
    console.log(row);
  })
  .on("end", function () {
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });