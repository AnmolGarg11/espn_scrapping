const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const AllmatchesgObj = require("./allMatch");
const iplPath = path.join(__dirname,"ipl");
dircreator(iplPath);

//home page

request(url , cb);

function cb(err , response , html)
{
    if(err)
    {
        console.log(err);
    }
    else{
        extractLink(html);
    }
}

//extract link of view all result

function extractLink(html){
   let $ =  cheerio.load(html);
  let anchorEle =  $("a[data-hover='View All Results']");
  let link = anchorEle.attr("href");
//   console.log(link);
  let fullLink = "https://www.espncricinfo.com" + link;
//   console.log(fullLink);
     AllmatchesgObj.gAlMatches(fullLink);

}


function dircreator(filepath)
{
  if(fs.existsSync(filepath)==false)
  {
    fs.mkdirSync(filepath);
  }
}


