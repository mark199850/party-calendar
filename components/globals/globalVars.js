const API_URL = Platform.OS === 'ios' ? 'https://nodejs-server-test-app.herokuapp.com' : 'https://nodejs-server-test-app.herokuapp.com';
//const API_URL = Platform.OS === 'ios' ? 'https://nodejs-server-test-app.herokuapp.com' : 'http://192.168.0.67:3001';

global.NodeJS_URL = API_URL;