Coding Exercise
===============

This is a simple files processing microservice. It accepts filtering parameters based on data columns in the file as well as a directive to order the result.
The result of the processing is returned as a json formatted text.

Getting Started
---------------
* Install node.js and supplemental libraries
* `npm install`
* Start the server (--harmony_array_includes flag set to properly handle array inclusion checks)
* `node --harmony_array_includes server.js`
* In a separate terminal make the api call: 
* `curl http://0.0.0.0:3000/organizations?[parameter=value]`
* For example:
* `curl http://0.0.0.0:3000/organizations?category=Non-Profit\&orderby=name\&direction=dsc |json_pp`


server.js: runs an Express server on localhost port 3000.

routes/app.js: routes requests to business logic modules

lib: business logic. For this exercise, there is just 'processing.js' 


Further improvements:
--------------------

1. make the api able to take a file reference as the parameter or download 
files from a remote repository

2. add tests 

3. elaborate errors handling and logging

4. add status to the returned response 
