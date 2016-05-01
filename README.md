david barkhuizen @ 2016  
# jackal
persistence free end-to-end message encryption in the browser  

powered by 
* nodejs @ https://nodejs.org/en
* expressjs @ http://expressjs.com
* socket.io
* the Stanford Javascript Crypto Library @ https://github.com/bitwiseshiftleft/sjcl 

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