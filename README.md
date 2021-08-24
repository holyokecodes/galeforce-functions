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