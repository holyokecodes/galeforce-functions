const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();

// Init
admin.initializeApp();
app.use(cors({ origin: true }));


const sessionTemplate = {
    auto_play: false,
    mute: false,
    player_locations: [],
    screen_url: "https://docs.google.com",
    session_code: "",
    session_secret: "",
    teams: [
        {
            completed_missions: [],
            control_stage: "Learn to Drive",
            team_name: "team1",
            training_stage: "Learn to Drive"
        },
        {
            completed_missions: [],
            control_stage: "Learn to Drive",
            team_name: "team2",
            training_stage: "Learn to Drive"
        },
        {
            completed_missions: [],
            control_stage: "Learn to Drive",
            team_name: "team3",
            training_stage: "Learn to Drive"
        },
        {
            completed_missions: [],
            control_stage: "Learn to Drive",
            team_name: "team4",
            training_stage: "Learn to Drive"
        }
    ],
    unlock_map: false
}


app.post('/createsession', async (req, res) => {
    let newSession = sessionTemplate;
    newSession.session_code = 'ABCDE';
    newSession.session_secret = '12345';

    await admin.firestore().collection('sessions').add(newSession);

    res.json({
        session_code: 'ABCDE',
        session_secret: '12345'
    });
});

exports.galeforce = functions.https.onRequest(app);
