Node Express API Example
========================

This is a simple files processing microservice. It accepts filtering parameters based on data columns in the file as well as a directive to order the result.
The result of the processing is returned as a json formatted text.

Getting Started
---------------
* Install node.js and supplemental libraries
* `npm install`
* Start the server 
* `npm start`
* In a separate terminal make the api call: 
* `curl http://0.0.0.0:3000/organizations[/:file_to_be_processed_id]?[parameter=value]`
* For example:
* `curl http://0.0.0.0:3000/organizations?category=Non-Profit\&orderby=name\&direction=dsc |json_pp`
* or
* `curl http://0.0.0.0:3000/organizations/ind1?category=Non-Profit\&orderby=name\&direction=dsc |json_pp`


server.js: runs an Express server on localhost port 3000.

routes/app.js: routes requests to business logic modules

lib: business logic. For this exercise, there is just 'processing.js' 

