# galeforce-functions

## Setup and information
Launch firebase emulator with `firebase emulators:start`

The emulator dashboard will open on http://localhost:4000

Send test requests to http://localhost:5001/savedblocks/us-central1/galeforce/endpoint


Deploy to firebase with `firebase deploy --only functions`

Live function at `https://us-central1-savedblocks.cloudfunctions.net/galeforce/endpoint`

---
## Endpoints

### Create Session

Creates a new session in Firestore. This is the only time session_secret will be retuned.

`POST /createsession`

Response:
```json
{
    "session_code": "ABCDE",
    "session_secret": "12345"
}
```

### Session
Returns all public information for a session.

`GET /session`

Request:
```
?session_code=ABCDE
```

Response:

```json
{
    "auto_play": false,
    "mute": false,
    "player_locations": [],
    "screen_url": "https://docs.google.com",
    "session_code": "ABCDE",
    "teams": [
        {
            "completed_missions": [],
            "control_stage": "Learn to Drive",
            "team_name": "team1",
            "training_stage": "Learn to Drive"
        },
        {
            "completed_missions": [],
            "control_stage": "Learn to Drive",
            "team_name": "team2",
            "training_stage": "Learn to Drive"
        },
        {
            "completed_missions": [],
            "control_stage": "Learn to Drive",
            "team_name": "team3",
            "training_stage": "Learn to Drive"
        },
        {
            "completed_missions": [],
            "control_stage": "Learn to Drive",
            "team_name": "team4",
            "training_stage": "Learn to Drive"
        }
    ],
    "unlock_map": false
}
```

### Settings
Set settings for a session. Anything you put in the settings object will overwrite the settings for that group

`POST /settings`

Body:
```json
{
    "session_code": "ABCDE",
    "session_secret": "12345",
    "settings": {
        "auto_play": true,
        "mute": true,
        ...
    }
}
```

Response:
```json
{
    "auto_play": true,
    "mute": true,
    ...
}
```
or
```json
{
    "error": "error"
}
```

### Player location
Sets the location of a player

`POST /playerlocation`

Request:
```
?session_code=ABCDE&player_name=Jacob&location=ControlRoom
```

Response:
```json
[
    {
        "location": "TrainingComplex",
        "player_name": "Jacob",
        "timestamp": 1630331133628
    },
    {
        "location": "ControlRoom",
        "player_name": "Sam",
        "timestamp": 1630331092038
    }
]
```
or
```json
{
    "error": "error"
}
```

### Complete Mission
Sets the location of a player

`POST /completemission`

Request:
```
?session_code=ABCDE&team_name=team1&mission_id=A1
```

Response:
```json
{
    "training_stage": "Learn to Drive",
    "team_name": "team4",
    "completed_missions": [
        "B3"
    ],
    "control_stage": "Learn to Drive"
}
```
or
```json
{
    "error": "error"
}
```