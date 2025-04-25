# Ninsar
[![Deploy to Firebase Hosting on merge](https://github.com/entur/ninsar/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/entur/ninsar/actions/workflows/firebase-hosting-merge.yml)

Frontend app for Line statistics. 

Getting line statistics from [Kilili](https://github.com/entur/kilili).

## Development

To run for development, simply do:

```
npm install
npm run start
```

To run together with a local instance of [Kilili](https://github.com/entur/kilili) on port 8080.

Forwarding proxy is configured in the package.json file. In order to avoid CORS problems.

## Authentication

Uses Auth0 to authenticate users.
