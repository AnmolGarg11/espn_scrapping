
const request = require("request");
const cheerio = require("cheerio");

const matchDetailObj = require("./matchdetail");

function getAllMatchesLink(url) {
  request(url, function (err, response, html) {
    if (err) console.log(err);
    else extractAllLink(html);
  });
}

//find link of matches

function extractAllLink(html) {
  let $ = cheerio.load(html);
  let scoreElements = $("a[data-hover='Scorecard']"); //will give array of all matches scores
  for (let i = 0; i < scoreElements.length; i++) {
    let link = $(scoreElements[i]).attr("href");
    let fullLink = "https://www.espncricinfo.com/" + link;
    console.log(fullLink);
    matchDetailObj.pmd(fullLink);
  }
}

module.exports = {
  gAlMatches : getAllMatchesLink
}