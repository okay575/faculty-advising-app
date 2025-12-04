Faculty Schedule and Consultation Planner (Expo React Native)

This is a small prototype mobile app for faculty to publish arranged schedules and set a consultation status for students to check.

Quick features
- Faculty: add schedule items, toggle status Available / Busy, clear schedules
- Student: view faculty status and published schedules
- Local persistence using AsyncStorage (no external backend yet)

Authentication (prototype)
- This scaffold includes local `Sign up` / `Sign in` screens. Accounts are stored locally on the device for prototyping only (not secure). Faculty accounts can add schedules; students can sign in and select a faculty to view their published schedules and availability.

Setup (Windows PowerShell)

1) Install Node.js (if not installed) and then run:

```powershell
npm install -g expo-cli
cd "d:\sir dave - anton\Faculty Schedule and Consultation Planner"
npm install
npx expo start
```

2) Open the Expo devtools in your browser and run on Android emulator / iOS simulator (macOS) or scan the QR with the Expo Go app on your phone.

Next steps
- Integrate Firebase for authentication and realtime presence (so students immediately see status changes)
- Add push notifications for new schedules / status changes
- Add multi-faculty support (list of faculty) and per-faculty accounts

Notes
- This scaffold uses `@react-native-async-storage/async-storage` for local persistence. For production use, move to a server-backed store.
