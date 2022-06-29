const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const url =
  "https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";

//home page
function processMatchDetails(url){
request(url, cb); }

function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    extractMatchDetail(html);
  }
}

function extractMatchDetail(html)
{
   let $ = cheerio.load(html);
   let descElem = $(" .header-info .description");
   let result = $(".event .status-text");
   let stringArr = descElem.text().split(",");
   let vanue = stringArr[1].trim();
   let date = stringArr[2].trim();
   console.log(vanue);
   console.log(date);
   result = result.text();
     let innings =  $(".card.content-block.match-scorecard-table .Collapsible");
    
    for(let i=0; i<innings.length; i++)
    {
       let teamName = $(innings[i]).find("h5").text();
       teamName = teamName.split("INNIGS")[0].trim();
       let opponentIndex = i==0 ? 1 : 0;
       let opponentName = $(innings[opponentIndex]).find("h5").text();
       opponentName = opponentName.split("INNINGS")[0].trim();

       let cInning = $(innings[i]);
       console.log(`${vanue} | ${date} | ${teamName} | ${opponentName} | ${result}`);
    

    let allRows = cInning.find(".table.batsman tbody tr");
    for(let j=0; j<allRows.length; j++)
    {
        let allCols = $(allRows[j]).find("td");
        let isWorthy = $(allCols[0]).hasClass("batsman-cell");

        if(isWorthy==true)
        {
         let playerName = $(allCols[0]).text().trim();
         let runs = $(allCols[2]).text().trim();
         let balls = $(allCols[3]).text().trim();
         let fours = $(allCols[5]).text().trim();
         let sixes = $(allCols[6]).text().trim();
         let sr = $(allCols[7]).text().trim();
         console.log(
           `  ${playerName} | ${runs} | ${balls} | ${fours} | ${sixes} | ${sr}`
         );

         processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, vanue, date, result);
        }
    }

    }

}
function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, vanue, date, result)
{
  let teampath = path.join(__dirname , "ipl" , teamName);
  dircreator(teampath);
  let filepath = path.join(teampath , playerName + ".xlsx");
  let content = excelReader(filepath , playerName);
  let playerObj = {
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    sr,
    opponentName,
    vanue,
    date,
    result
  }
  content.push(playerObj);
  excelWriter(filepath , content , playerName);


}

function dircreator(filepath) {
  if (fs.existsSync(filepath) == false) {
    fs.mkdirSync(filepath);
  }
}

function excelWriter(filepath,json, sheetname)
{
  let newWB = xlsx.utils.book_new();
  let newWS = xlsx.utils.json_to_sheet(json);
  xlsx.utils.book_append_sheet(newWB, newWS, sheetname);
  xlsx.writeFile(newWB, filepath);
}

function excelReader(filepath, sheetname)
{
  if(fs.existsSync(filepath)==false)
  {
    return [];
  }
  let wb = xlsx.readFile(filepath);
  let exceldata = wb.sheets[sheetname];
  let ans = xlsx.utils.sheet_to_json(exceldata);
  return ans;
}

module.exports = {
  pmd : processMatchDetails
}