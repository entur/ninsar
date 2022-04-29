# Ninsar
[![Deploy to Firebase Hosting on merge](https://github.com/entur/ninsar/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/entur/ninsar/actions/workflows/firebase-hosting-merge.yml)

Frontend app for Line statistics. 
Getting line statistics from [Uttu](https://github.com/entur/uttu), for the lines created in [Nplan](https://github.com/entur/enki).
Getting line statistics from [Marduk](https://github.com/entur/marduk), for the data upload in Chouette via [Oprerator portal](https://github.com/entur/bel)



## Development

To run for development, simply do:

```
npm install
npm run start
```

To run together with a local instance of [Uttu](https://github.com/entur/uttu) on port 11701, add the following to [.env.development.local](.env.development.local).

```
REACT_APP_UTTU_API_URL=/services/flexible-lines/exportedLineStatistics/graphql
```

Forwarding proxy is configured in the package.json file. In order to avoid CORS problems.

## Authentication

Uses Auth0 to authenticate users.