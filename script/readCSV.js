"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var csv_parse_1 = require("csv-parse");
var formattedData = {};
/**
Org ID
Campaign ID -> audienceId
Campaign Set ID -> campaign Id
GEO
Current Max Bid value
Target Max Bid value (from csv file?)
 */
fs.createReadStream("data/mock-campaign-data.csv")
    .pipe((0, csv_parse_1.parse)({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
    var _a;
    console.log("row", row);
    var organizationId = row[0], campaignId = row[1], campaignSetId = row[2], country = row[3], currMaxBid = row[4], targetMaxBid = row[5];
    if (formattedData[campaignId]) {
        formattedData[campaignId].bids[country] = { country: country, targetMaxBid: targetMaxBid };
    }
    else {
        formattedData[campaignId] = {
            organizationId: organizationId,
            audienceId: campaignId,
            campaignId: campaignSetId,
            bids: (_a = {},
                _a[country] = { country: country, targetMaxBid: targetMaxBid },
                _a)
        };
    }
    console.log("formattedData", formattedData);
})
    .on("end", function () {
    console.log("finished");
    fs.writeFileSync('data/output/data.json', JSON.stringify(formattedData, null, 2), 'utf-8');
})
    .on("error", function (error) {
    console.log(error.message);
});
