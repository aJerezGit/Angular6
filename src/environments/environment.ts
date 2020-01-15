// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyASxcLdPrwyvMWrC71w_qCcOV9Ng4AB3C4",
    authDomain: "angular6platzinger.firebaseapp.com",
    databaseURL: "https://angular6platzinger.firebaseio.com",
    projectId: "angular6platzinger",
    storageBucket: "angular6platzinger.appspot.com",
    messagingSenderId: "98007170803",
    appId: "1:98007170803:web:0701fcf2e4014c44760186"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
