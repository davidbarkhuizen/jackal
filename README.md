# jackal
david barkhuizen @ 2016  
persistence-free end-to-end encrypted browser-to-browser messaging with 1 time pads  
using the Stanford Javascript Crypto Library @ https://github.com/bitwiseshiftleft/sjcl 

powered by 
* nodejs (https://nodejs.org/en/)
* expressjs (http://expressjs.com/)
* socket.io (http://socket.io/)
 
## servers

* pagesrv.js
  * http
  * page server

* msgsrv.js
  * message server
  * websocket-based
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