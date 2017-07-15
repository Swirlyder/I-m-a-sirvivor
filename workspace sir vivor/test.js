const fs = require('fs');
let file = {
	leaderboard: {},
	"questions": [
    {
      "category": "ae",
      "question": "Z",
      "answers": [
        "z"
      ],
      "user": "cheese"
    },
    {
      "category": "ae",
      "question": "Y",
      "answers": [
        "y"
      ],
      "user": "cheese"
    },
    {
      "category": "ae",
      "question": "A",
      "answers": [
        "a"
      ],
      "user": "cheese"
    },
    {
      "category": "ae",
      "question": "B",
      "answers": [
        "b"
      ],
      "user": "cheese"
    },
    {
      "category": "ae",
      "question": "C",
      "answers": [
        "c"
      ],
      "user": "cheese"
    },
    {
      "category": "ae",
      "question": "D",
      "answers": [
        "d"
      ],
      "user": "cheese"
    },
    {
      "category": "ae",
      "question": "E",
      "answers": [
        "e"
      ],
      "user": "cheese"
    },
    {
      "category": "ae",
      "question": "F",
      "answers": [
        "f"
      ],
      "user": "cheese"
    },
    {
      "category": "ae",
      "question": "G",
      "answers": [
        "g"
      ],
      "user": "cheese"
    },
    {
      "category": "ae",
      "question": "H",
      "answers": [
        "h"
      ],
      "user": "cheese"
    }
  ],
  "wlquestions": [],
  "submissions": [],
  "wlsubmissions": []
};
for (let i = 0; i < 2000; i++) {
	file[i] = {
		name: i,
		parts: 0,
		realhosts: 0,
		firsts: 1,
		seconds: 0,
	}
}
fs.writeFileSync("./configchat-plugins/trividata.json", JSON.stringify(file));