var express = require("express");
const { route } = require(".");
var router = express.Router();
const { Userdata } = require("./users");

const Users = require("../models/users");

var cardselected = ["0", "0", "0", "0", "0"];
var cardindexes = [0, 0, 0, 0, 0];
var voting = ["0", "0", "0", "0", "0"];
var winner = "";
var highestscore = 0;

var playerturn = 0;
var cardSelector = 0;
var description = "";
var rounds = [false, false, false, false, false];
var playermatches = [false, false, false, false, false];
var matches = 0;
var players = [];

var voter = 0;

/* Get Cards */
var cardsArray = [];
generateCards();

function generateCards() {
  randomshuffle();
  for (var i = 0; i < 25; i++) {
    cardsArray.push({ cardno: i.toString() });
  }
}

router.post("/start", (req, res, next) => {
  players = [];
  var deck = randomcard();
  console.log("Player: ", players);
  players.push({
    name: req.body.player1,
    cards: deck[0].cardlist,
    score: [0, 0, 0, 0, 0],
    total: 0,
  });
  players.push({
    name: req.body.player2,
    cards: deck[1].cardlist,
    score: [0, 0, 0, 0, 0],
    total: 0,
  });
  players.push({
    name: req.body.player3,
    cards: deck[2].cardlist,
    score: [0, 0, 0, 0, 0],
    total: 0,
  });
  players.push({
    name: req.body.player4,
    cards: deck[3].cardlist,
    score: [0, 0, 0, 0, 0],
    total: 0,
  });
  players.push({
    name: req.body.player5,
    cards: deck[4].cardlist,
    score: [0, 0, 0, 0, 0],
    total: 0,
  });
  console.log(players);
  res.render("playerturn", {
    player: (playerturn + 1).toString(),
    cards: players[playerturn].cards,
  });
});
function randomcard() {
  var temparray = [];
  cardsArray.forEach((card) => {
    temparray.push(card);
  });
  var player = [];
  for (var p = 0; p < 5; p++) {
    var playercards = [];
    for (var i = 0; i < 5; i++) {
      playercards.push(temparray.pop());
    }
    player.push({ cardlist: playercards });
  }
  return player;
}
function randomshuffle() {
  cardsArray.sort(() => Math.random() - 0.5);
}
module.exports = router;

/* player selects a card */
var selectedcard = "";

router.post("/cardselect", (req, res, next) => {
  selectedcard = players[playerturn].cards[req.body.val].cardno;
  cardindexes[playerturn] = req.body.val;

  cardselected[playerturn] = selectedcard;

  res.render("cardDisplay", {
    card: selectedcard,
  });
});

router.post("/choosecardturns", (req, res, next) => {
  description = req.body.description;
  console.log("Card section: ", players);
  if (cardSelector > players.length) {
  } else if (cardSelector == playerturn) {
    cardSelector++;

    res.render("otherselects", {
      description: description,
      player: (cardSelector + 1).toString(),
      cards: players[cardSelector].cards,
    });
  } else {
    res.render("otherselects", {
      description: description,
      player: (cardSelector + 1).toString(),
      cards: players[cardSelector].cards,
    });
  }
});

router.post("/nextvoter", (req, res, next) => {
  console.log("Voter :", voter + 1);
  if (voter != 5) {
    voting[voter] = cardselected[req.body.val];
    voter++;
  }
  if (voter >= players.length || (voter == 4 && voter == playerturn)) {
    if (!rounds[playerturn]) scoreupdate();
    res.render("scoreboard", { players: players, playerturn: playerturn });
  } else if (voter == playerturn) {
    voter++;
    res.render("voting", {
      MP: playerturn + 1,
      player: voter + 1,
      cards: cardselected.sort(() => Math.random() - 0.5),
    });
  } else {
    res.render("voting", {
      MP: playerturn + 1,
      player: voter + 1,
      cards: cardselected.sort(() => Math.random() - 0.5),
    });
  }
});
function scoreupdate() {
  voting.forEach((card, index) => {
    if (index != playerturn && card == selectedcard) {
      playermatches[index] = true;
      matches++;
    }
  });
  console.log("MATCHES: ", matches);
  console.log("LIST: ", playermatches);
  if (matches == 4) {
    playermatches.forEach((player, index) => {
      if (player) {
        players[index].score[playerturn] = 2;
      }
    });
    players[playerturn].score[playerturn] = 0;
  } else if (matches == 0) {
    playermatches.forEach((player, index) => {
      players[index].score[playerturn] = 3;
    });
    players[playerturn].score[playerturn] = 0;
  } else if (matches == 1) {
    playermatches.forEach((player, index) => {
      console.log("player: ", index + 1);
      if (playermatches[index]) {
        players[index].score[playerturn] = 4;
      } else {
        players[index].score[playerturn] = 1;
      }
    });
    players[playerturn].score[playerturn] = 3;
  } else {
    playermatches.forEach((player, index) => {
      if (index != playerturn) {
        players[index].score[playerturn] = 4;
      }
    });
    players[playerturn].score[playerturn] = 3;
  }

  players.forEach((player, index) => {
    player.cards.splice(cardindexes[index], 1);
  });

  rounds[playerturn] = true;
  matches = 0;
  playermatches = [false, false, false, false, false];
}
router.get("/nextround", (req, res, next) => {
  if (rounds[playerturn]) {
    cardselected = ["0", "0", "0", "0", "0"];
    voting = ["0", "0", "0", "0", "0"];
    playerturn++;
    cardSelector = 0;
    if (playerturn == 4) {
    }
  }

  res.render("playerturn", {
    player: (playerturn + 1).toString(),
    cards: players[playerturn].cards,
  });
});

router.get("/home", (req, res, next) => {
  reset();
  generateCards();

  res.render("options", { title: "Dixit App" });
});
router.get("/result", (req, res, next) => {
  var playerscore = 0;
  console.log("Players: ", players);
  players.forEach((player) => {
    playerscore = 0;
    for (var i = 0; i < 5; i++) {
      playerscore = playerscore + player.score[i];
    }
    player.total = playerscore;
    if (playerscore > highestscore) {
      highestscore = playerscore;
    }
  });

  res.render("results", {
    top: winner,
    players: players,
    highest: highestscore,
  });
});

function reset() {
  cardselected = ["0", "0", "0", "0", "0"];
  cardindexes = [0, 0, 0, 0, 0];
  voting = ["0", "0", "0", "0", "0"];
  highestscore = 0;

  playerturn = 0;
  cardSelector = 0;
  description = "";
  rounds = [false, false, false, false, false];
  playermatches = [false, false, false, false, false];
  matches = 0;
  voter = 0;
  players = [];

  /* Get Cards */
  cardsArray = [];
}
router.post("/nextplayer", (req, res, next) => {
  if (cardSelector != 5) {
    cardselected[cardSelector] =
      players[cardSelector].cards[req.body.val].cardno;
    cardindexes[cardSelector] = req.body.val;

    cardSelector++;
  }
  if (
    cardSelector >= players.length ||
    (cardSelector == 4 && cardSelector == playerturn)
  ) {
    voter = 0;
    if (voter == playerturn) voter++;

    res.render("voting", {
      MP: playerturn + 1,
      player: voter + 1,
      cards: cardselected.sort(() => Math.random() - 0.5),
    });
  } else if (cardSelector == playerturn) {
    cardSelector++;
    res.render("otherselects", {
      description: description,
      player: (cardSelector + 1).toString(),
      cards: players[cardSelector].cards,
    });
  } else {
    res.render("otherselects", {
      description: description,
      player: (cardSelector + 1).toString(),
      cards: players[cardSelector].cards,
    });
  }
});
