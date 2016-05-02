# jackal
david barkhuizen @ 2016  
persistence-free end-to-end encrypted browser-to-browser messaging with 1 time pads  
using the Stanford Javascript Crypto Library @ https://github.com/bitwiseshiftleft/sjcl 

powered by 
* nodejs (https://nodejs.org/en/)
* expressjs (http://expressjs.com/)
* socket.io (http://socket.io/)

## basic model


## servers

* pagesrv.js
  * http
  * page server
  * any get request will server up the UI

* msgsrv.js
  * websocket message server
  * manages channels
  * accepts incoming websocket connections
  * distributes messages to channel members

## operations

### config

#### pagesrv.config.json

	{
		"port" : 8666,
		"entrypoint" : "bootstrap.js",
		"static": "client",
		"css" : "css.css"
	}

#### msgsrv.config.json

	{
		"port" : 8667
	}