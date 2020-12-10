var db = require('../database/db');

// const saySomething = (req, res, next) => {
//     res.status(200).json({
//         body: 'Hello from the server!',
//         scores: [1, 5, 10, 35],
//     });
// };

const addScore = (req, res, next) => {
    // recieve a query in the get method and insert into scores database
    let username = req.query.username;
    let score = req.query.score;

    let cb = (err) => {
        res.status(204).json({});
        console.log(`Added ${username}'s score to database`)
        console.log(err);
    }

    let sql = `insert into scores (username, score) values ('${username}', ${score})`
    db.run(sql, cb)
}

const getScores = (req, res, next) => {
    // recieve all score data ordered by score

    let sql = `select * from scores order by score desc`;
    let scores = [];
    db.all(sql, (err, rows) => {
        if (err) throw (err);
        rows.forEach((row) => {
            let score = {};
            Object.keys(row).forEach((k) => {
                score[k] = unescape(row[k]);
            });
            scores.push(score);
        });
        res.status(200).json(scores);
    })
}

const getHighScore = (req, res, next) => {
    // let highScore = Math.floor(Math.random() * 100);
    let sql = `select * from scores order by score desc`;

    db.get(sql, (err, row) => {
        if (err) throw (err);
        let highScore = {};
        Object.keys(row).forEach((k) => {
            highScore[k] = unescape(row[k]);
        });
        res.status(200).json(highScore);
    })
};

// module.exports.saySomething = saySomething;
module.exports.getHighScore = getHighScore;
module.exports.getScores = getScores;
module.exports.addScore = addScore;