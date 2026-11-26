# GG Arena — Gaming Tournament Portal (Frontend Only)

A responsive React esports tournament portal. It uses browser Local Storage as its only data store.

## Requirements
- Node.js 18+ and npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Admin demo login
- Username: `admin`
- Password: `admin123`

## Features
- Player registration/login and admin login
- Protected player/admin routes
- Team create/edit/delete
- Tournament browse/search/filter/details and team registration
- Live-only room credentials for players
- Completed tournament results
- Admin tournament, registration, credential, result and announcement management
- Responsive dark esports UI, toast messages and form validation

## Data storage
The following browser Local Storage keys are used:
`users`, `teams`, `tournaments`, `registrations`, `results`, `announcements`, plus `session`.

This is a frontend demonstration. Local Storage is device/browser-specific and is not secure:
- Passwords are stored in plain text for demo purposes only.
- Admin credentials are hardcoded in the frontend and must not be used for a real production system.
- Data is not shared across browsers/devices or between different users' devices.
- Anyone with browser developer tools can modify Local Storage.

To reset demo data, clear the site's Local Storage and reload the page.


## Player UIDs and team slots
- Each player receives a unique Player UID after registration (shown on their user dashboard).
- Team captains add four teammates by entering their Player UIDs; only registered users with valid, distinct UIDs can be added.
- Admins set a tournament's total team slots when creating or editing it.
- Tournament pages show registered/total slots, and registration is blocked when capacity is reached.
