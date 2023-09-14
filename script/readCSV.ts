import * as fs from 'fs';
import {parse} from 'csv-parse';

export type FormattedData = {
  [audienceId: string]: {
    organizationId: string;
    audienceId: string;
    campaignId: string;
    bids: {
      [country: string]: {
        country: string;
        targetMaxBid: number;
      };
    };
  };
};

let formattedData: FormattedData = {}

/**
Org ID
Campaign ID -> audienceId
Campaign Set ID -> campaign Id
GEO
Current Max Bid value
Target Max Bid value (from csv file?)
 */

fs.createReadStream("data/mock-campaign-data.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    console.log("row", row);

    const [organizationId, campaignId, campaignSetId, country, currMaxBid, targetMaxBid] = row;

    if (formattedData[campaignId]){
      formattedData[campaignId].bids[country] = {country, targetMaxBid}
    }
    else{
      formattedData[campaignId] = {
        organizationId,
        audienceId: campaignId,
        campaignId: campaignSetId,
        bids: {
          [country]: {country, targetMaxBid}
        }
      }
    }

    console.log("formattedData", formattedData)
  })
  .on("end", function () {
    console.log("finished");
    fs.writeFileSync('data/output/data.json', JSON.stringify(formattedData, null, 2) , 'utf-8');
  })
  .on("error", function (error) {
    console.log(error.message);
  });