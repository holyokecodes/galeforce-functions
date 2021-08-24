const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const { v4: uuidv4 } = require('uuid');

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

/**
 * Creates a new session and saves it in Firestore
 */
app.post('/createsession', async (req, res) => {

    const sessionCode = generateSessionCode(5);
    const sessionSecret = uuidv4();

    let newSession = Object.assign({}, sessionTemplate);
    newSession.session_code = sessionCode;
    newSession.session_secret = sessionSecret;

    await admin.firestore().collection('sessions').add(newSession);

    res.json({
        session_code: sessionCode,
        session_secret: sessionSecret
    });
});

/**
 * Gets the read only data from a session
 * @query session_code code of the session you want to lookup
 */
app.get('/session', async (req, res) => {

    const sessionCode = req.query.session_code;

    if (sessionCode != null) {
        const sessionsRef = admin.firestore().collection('sessions');
        const sessionQuery = await sessionsRef.where('session_code', '==', sessionCode).limit(1).get();

        if (sessionQuery.empty) {
            res.status(404).json({ error: 'session not found' });
        } else {
            sessionQuery.forEach(session => {
                let modifiedSession = Object.assign({}, session.data());
                console.log(modifiedSession);
                delete modifiedSession.session_secret;
                res.json(modifiedSession);
                return;
            });
        }
    } else {
        res.status(404).json({ error: 'null session_code' });
    }
});

/**
 * Generates a random alphanumeric code
 * @param length how long should the code be
 */
function generateSessionCode(length) {
    const possible = "ABCDEFGHJKMNPQRTUVWXYZ0123456789";
    let text = "";
    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.galeforce = functions.https.onRequest(app);
