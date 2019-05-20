let utils = require("./utils"),
    config = require("./config");

let totalSessionCount = 0,
    nonZeroSessionCount = 0,
    averageSessionTimeTotal = 0,
    averageSessionNonZeroTotal = 0;

let getNormalReport = () => {
    let reportJSON = utils.readfileToMemory(config.REPORT_FILE_NAME);
    let sessionAvg = 0;
    Object.keys(reportJSON).forEach(userId => {
        //function to find the total session count
        totalSessionCount += parseInt(reportJSON[userId].count)

        //function to find non-zero session count
        let zeros = reportJSON[userId].sessions.filter(data=>{return data == 0;}).length;
        nonZeroSessionCount += parseInt(reportJSON[userId].count) - zeros;

        sessionAvg += reportJSON[userId].sessions.reduce((data,acc)=>{return data+parseInt(acc);},0);
    });
    //function to find the average session time
    averageSessionTimeTotal = sessionAvg/totalSessionCount;
    //function to find the average session time-non zero
    averageSessionNonZeroTotal = sessionAvg/nonZeroSessionCount;
    console.log("Total Queries Processed",config.QUERY_PROCESS_COUNT);
    console.log("totalSessionCount",totalSessionCount);
    console.log("nonZeroSessionCount",nonZeroSessionCount);
    console.log("averageSessionTimeTotal",averageSessionTimeTotal);
    console.log("averageSessionNonZeroTotal",averageSessionNonZeroTotal);

}

let getAdvancedReport = (sessionDuration, ltgteq) => {
    let reportJSON = utils.readfileToMemory(config.REPORT_FILE_NAME);
    let sessionAvg = 0;
    let advancedSessionCount = 0;
    Object.keys(reportJSON).forEach(userId => {
        //function to find the total session count
        totalSessionCount += parseInt(reportJSON[userId].count)

        //function to find non-zero session count
        let zeros = reportJSON[userId].sessions.filter(data=>{return data == 0;}).length;
        nonZeroSessionCount += parseInt(reportJSON[userId].count) - zeros;

        sessionAvg += reportJSON[userId].sessions.reduce((data,acc)=>{return data+parseInt(acc);},0);

        //function to find the total session count by session duration
        if(ltgteq == "lt"){
            advancedSessionCount += reportJSON[userId].sessions.filter(data=>{return data < sessionDuration;}).length;
        }
        else if(ltgteq == "gt"){
            advancedSessionCount += reportJSON[userId].sessions.filter(data=>{return data > sessionDuration;}).length;
        }
        else if(ltgteq == "eq"){
            advancedSessionCount += reportJSON[userId].sessions.filter(data=>{return data == sessionDuration;}).length;
            
        }
    });
    //function to find the average session time
    averageSessionTimeTotal = sessionAvg/totalSessionCount;
    //function to find the average session time-non zero
    averageSessionNonZeroTotal = sessionAvg/nonZeroSessionCount;
    console.log("Total Queries Processed",config.QUERY_PROCESS_COUNT);
    console.log("total session count",totalSessionCount);
    console.log("non zero session count",nonZeroSessionCount);
    console.log("average session time",averageSessionTimeTotal);
    console.log("average non zero session count",averageSessionNonZeroTotal);
    console.log(`Session count for ${ltgteq == "lt" ? "less than" : ltgteq == "gt" ? "greater than" : ""} ${sessionDuration} seconds is ${advancedSessionCount}`);

    

}


module.exports.getReport = (sessionDuration = 0, ltgteq = 0) => {
    if (ltgteq == 0) {
        return getNormalReport();
    }
    return getAdvancedReport(sessionDuration, ltgteq)
}