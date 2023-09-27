import * as fs from 'fs';
import {parse} from 'csv-parse/sync';

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

export type RoasBidsData = {
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

export type roasBidsDataset = {
  organizationId: string;
  campaignSetId: string;
  campaignId: string;
  country: string;
  currentMaxBid: string;
  targetMaxBid: number;
};


  const roasBids: RoasBidsData = {};

  const fileContent = fs.readFileSync('data/mock-campaign-data.csv', { encoding: 'utf-8' });

  const records = parse(fileContent, { delimiter: ',', from_line: 1, columns:true });
  console.log("records", records)

  records.forEach(
    (row: roasBidsDataset) => {
      const {organizationId, campaignId, campaignSetId, country, currentMaxBid, targetMaxBid} = row
      if (roasBids[campaignId]) {
        roasBids[campaignId].bids[country] = { country, targetMaxBid };
      } else {
        roasBids[campaignId] = {
          organizationId,
          audienceId: campaignId,
          campaignId: campaignSetId,
          bids: {
            [country]: { country, targetMaxBid },
          },
        };
      }
    },
  );

console.log(roasBids)