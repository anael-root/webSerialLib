
# webseriallib
Tiny library to ease webserial connection in browser.
[Demo](https://www.wearewebtools.com/webserial)

## Licence
This is licenced under MIT licence. Find more in the licence file.

## Usage

### Import library
import {webseriallib} from "webseriallib"

### Check if serial is available in your browser
webseriallib.isBrowserCompatible()

### Connect
var webserial = new webseriallib(this.speedSelected)  
await webserial.connect();

### Monitor variables
webserial.history  
webserial.connected

### Send message
webserial.send(message)

### Disconnect
webserial.disconnect()
