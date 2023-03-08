/**
 * @author Jörn Kreutel
 */
/*
 * generic method for calling a webapp passing / receiving json and callback methods
 *
 * method: the http method to be executed
 * requestpath: the path to be appended to the root path of the webapp
 * obj: an (optional object to be passed)
 * onsucccess: callback in case of success
 * onerror: callback in case of error
 */
function xhr(method, requestpath, obj, onsuccess, onerror) {

	return new Promise((resolve,reject) => {
        console.log("callWebapp()");

        // create the request
        var xmlhttp = new XMLHttpRequest();

        var url = null;

        if (requestpath) {

            if (requestpath.indexOf("/") == 0) {
                url = requestpath.substring(1);
            } else {
                url = requestpath;
            }
            console.log("url is: " + url);

            /*
             * specify the callback function using our own callback function arguments - this code will be executed as soon as we have started sending the request
             */
            xmlhttp.onreadystatechange = function() {

                switch (xmlhttp.readyState) {
                    case 4:
                        console.log("onreadstatechange: request finished and response is ready. Status is: " + xmlhttp.status)
                        // in case we have a request code of 200 OK, we execute the onsuccess function passed as an argument
                        if (xmlhttp.status == 200) {
                            // show how to access a response header
                            console.log("response Content-Type header is: " + xmlhttp.getResponseHeader("Content-type"));
                            console.log("responseType is: " + xmlhttp.responseType);
                            console.log("response is: " + xmlhttp.response);

                            if (onsuccess) {
                                // the function will be passed the request object to be free with regard to reading out its content
                                onsuccess(xmlhttp);
                            } else {
                            	console.log("request on " + url + " executed successfully, but no onsuccess callback is specified. Assume Promise is used and call resolve()");
								resolve(xmlhttp);
                            }
                        } else {
                            if (onerror) {
                                onerror(xmlhttp);
                            }
                            else {
                                console.error("got error processing request on " + url + ", but no onerror callback is specified. Assume Promise is used and call reject(). Status code is: " + xmlhttp.status);
                                reject(xmlhttp);
                            }
                        }
                        break;
                    // we add log messages for the other status
                    case 3:
                        console.log("onreadstatechange: processing response...");
                        break;
                    case 2:
                        console.log("onreadstatechange: response received.");
                        break;
                    case 1:
                        console.log("onreadstatechange: connection established.");
                        break;
                    case 0:
                        console.log("onreadstatechange: request not initialised yet.");
                        break;
                }
            };

            /*
             * open a connection to the server
             */
            xmlhttp.open(method, url, true);

            /*
            * configure the request
            */

            // a variable that will hold json data that will be sent with the request
            var json;

            // set the proper header information along with the request
            if (obj) {
                // create a json representation from the object
                json = JSON.stringify(obj);
                // set the header that indicates what type of content we are sending
                xmlhttp.setRequestHeader("Content-Type", "application/json");
            }

            // set the header indicating which content types we accept (quite coarse-grained, though)
            xmlhttp.setRequestHeader("Accept", "application/json, application/xml, text/html, text/plain");

            /*
            * send the request
            */

            // send the request and pass the json string as content or do not pass any content
            console.log("sending request...");
            if (obj) {
                xmlhttp.send(json);
            } else {
                xmlhttp.send();
            }
        } else {
            console.error("no requestpath specified! Ignore...");
        }
	});
}

// shows usage of the fetch api given the same parameters as passed above
function dofetch(method, requestpath, obj) {
	var fetchoptions = {
		method
	}
	if (obj) {
		fetchoptions.body = JSON.stringify(obj);
		fetchoptions.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, application/xml, text/html, text/plain"
        };
	}

	return new Promise((resolve,reject) => {
        fetch(requestpath, fetchoptions).then(response => {
			if (response.status == 200) {
				resolve(response);
			}
			else {
                reject(response);
			}
        });
    });
}
