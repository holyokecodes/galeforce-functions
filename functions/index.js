const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

// Init
admin.initializeApp();
app.use(cors({
    origin: '*'
}));

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
            control_stage: "Preparation",
            team_name: "team1",
            training_stage: "Learn to Drive"
        },
        {
            completed_missions: [],
            control_stage: "Preparation",
            team_name: "team2",
            training_stage: "Learn to Drive"
        },
        {
            completed_missions: [],
            control_stage: "Preparation",
            team_name: "team3",
            training_stage: "Learn to Drive"
        },
        {
            completed_missions: [],
            control_stage: "Preparation",
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
 * Writes settings for a session
 * @body session_code, session_secret, and the settings you want to write
 */
app.post('/settings', async (req, res) => {

    let json = req.body;

    let sessionCode = json.session_code;
    let sessionSecret = json.session_secret;
    let newSettings = json.settings;

    if (sessionCode == null) {
        res.status(404).json({ error: 'null session_code' });
        return;
    }

    if (sessionSecret == null) {
        res.status(404).json({ error: 'null session_secret' });
        return;
    }

    if (newSettings == null) {
        res.status(404).json({ error: 'null newSettings' });
        return;
    }

    const sessionsRef = admin.firestore().collection('sessions');
    const sessionQuery = await sessionsRef.where('session_code', '==', sessionCode).limit(1).get();

    if (sessionQuery.empty) {
        res.status(404).json({ error: 'session not found' });
        return;
    }

    sessionQuery.forEach(session => {
        let settings = session.data();

        if (settings.session_secret != sessionSecret) {
            res.status(404).json({ error: 'invalid secret' });
            return;
        }

        const docRef = admin.firestore().collection('sessions').doc(session.id);
        docRef.update(newSettings);
        res.json(newSettings);
    });
});

/**
 * Updates the players location
 * @query session_code code of the session you want to lookup
 * @query player_name Players username you want to update
 * @query location where is the player now
 */
app.post('/playerlocation', async (req, res) => {
    const sessionCode = req.query.session_code;
    const playerName = req.query.player_name;
    const location = req.query.location;

    const sessionsRef = admin.firestore().collection('sessions');
    const sessionQuery = await sessionsRef.where('session_code', '==', sessionCode).limit(1).get();

    if (sessionQuery.empty) {
        res.status(404).json({ error: 'session not found' });
        return;
    }

    sessionQuery.forEach(session => {
        const docRef = admin.firestore().collection('sessions').doc(session.id);

        let locations = session.data().player_locations;

        let playerInList = false
        locations.forEach(existingLocation => {
            if (existingLocation.player_name == playerName) {
                playerInList = true;
                existingLocation.location = location;
                existingLocation.timestamp = Date.now();
            }
        });

        if (!playerInList) {
            locations.push({ player_name: playerName, location: location, timestamp: Date.now() });
        }

        docRef.update({ player_locations: locations });
        res.json(locations);
    });
});


/**
 * Sets a mission as complete for a given team
 * @query session_code code of the session you want to lookup
 * @query team_name team to update
 * @query mission_id mission to mark as completed
 */
app.post('/completemission', async (req, res) => {
    const sessionCode = req.query.session_code;
    const teamName = req.query.team_name;
    const missionId = req.query.mission_id;


    const sessionsRef = admin.firestore().collection('sessions');
    const sessionQuery = await sessionsRef.where('session_code', '==', sessionCode).limit(1).get();

    if (sessionQuery.empty) {
        res.status(404).json({ error: 'session not found' });
        return;
    }

    sessionQuery.forEach(session => {
        const docRef = admin.firestore().collection('sessions').doc(session.id);

        let teams = session.data().teams;

        let targetTeam;

        teams.forEach(team => {
            if (team.team_name == teamName) {
                team.completed_missions.push(missionId);
                targetTeam = team;
            }
        });

        docRef.update({ teams: teams });
        res.json(targetTeam);
    });
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
