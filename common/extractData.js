const parse = require('csv-parse'),
      fs = require('fs'),
      path = require('path');
      utils = require('./utils'),
      config = require('./config'),
      report = require("./reportFunctions");
//var resultObj = { startTime: "", endTime: "", sessions: [], count: 0 };

module.exports.extractReportFromCsv = (filename) => {
    let reportJSON = {};
    return fs.createReadStream(path.join(__dirname, "../files/", filename))
        .pipe(parse({ delimiter: ',' }))
        //read the csv file and iterate through each record
        .on('data', function (csvrow) {
            config.QUERY_PROCESS_COUNT++;
            //check if the userid exists
            if (reportJSON[csvrow[0]]) {
                //yes
                //check if the time gap is within the stipulated time
                console.log("time diff",csvrow[0],utils.getTimeDiff(reportJSON[csvrow[0]].endTime, csvrow[1]),reportJSON[csvrow[0]].endTime, csvrow[1]);
                if (utils.getTimeDiff(reportJSON[csvrow[0]].endTime, csvrow[1]) < config.SESSION_BREAK_TIME) {
                    //yes
                    //update the end time for that user
                    reportJSON[csvrow[0]].endTime = csvrow[1];
                }
                else {
                    //no
                    //calculate the session duration from startTime and endTime and push to sessions array
                    console.log("time diff-session",csvrow[0],utils.getTimeDiff(reportJSON[csvrow[0]].startTime, reportJSON[csvrow[0]].endTime),reportJSON[csvrow[0]].startTime,reportJSON[csvrow[0]].endTime)
                    reportJSON[csvrow[0]].sessions.push(utils.getTimeDiff(reportJSON[csvrow[0]].startTime, reportJSON[csvrow[0]].endTime))
                    //increment the count by one
                    reportJSON[csvrow[0]].count += 1;
                    //update the startTime and EndTime to new date time
                    reportJSON[csvrow[0]].startTime = csvrow[1];
                    reportJSON[csvrow[0]].endTime = csvrow[1];
                }
            }
            else {
                //no
                console.log("first entry for ",csvrow[0]);
                //create a user object
                reportJSON[csvrow[0]] = {
                    sessions: [], count: 0
                }
                //update the startTime and EndTime to new date time
                reportJSON[csvrow[0]].startTime = csvrow[1];
                reportJSON[csvrow[0]].endTime = csvrow[1];
            }
        })
        .on('end', function () {
            //loop through the result json and add up the last remaining entry to sessions and count
            Object.keys(reportJSON).forEach(userId=>{
                //calculate the session duration from startTime and endTime and push to sessions array
                console.log("on end",userId,utils.getTimeDiff(reportJSON[userId].startTime, reportJSON[userId].endTime));
                reportJSON[userId].sessions.push(utils.getTimeDiff(reportJSON[userId].startTime, reportJSON[userId].endTime))
                //increment the count by one
                reportJSON[userId].count += 1;
                
            })
            //save the jsonObj to a file
            utils.writeToFile(JSON.stringify(reportJSON),config.REPORT_FILE_NAME);

            //generate report
            console.log("Report Generation Started");
            report.getReport(15,"lt");
            console.log("Report Generation Ended")
        });
}


