# express-userapp

Unofficial [UserApp](http://userapp.io) Express middleware to authenticate requests.

## Install

```
npm install express-userapp --save
```

## Usage

This middleware parses in the cookies of the incoming request for the ` ua_session_token `. With that token, the user data associated with it will be placed on the request object at ` req.userapp.user `

Use for all routes or on a individual routes.

```js
var express = require('express');
var UserApp = require('userapp');
var authenticate = require('express-userapp');
var app = express();
var APP_ID = 'userapp_app_id';

UserApp.initialize({appId: APP_ID});

app.use(authenticate(/* optionally put appId here */));

app.get('/self', function (req, res) {
	// If the user does not authenticate

  res.send(req.userapp.user);
});

app.listen(8000);

```

## TODO

* Add support for permissions and feature flags

## Run Tests

```
npm install
npm test
```