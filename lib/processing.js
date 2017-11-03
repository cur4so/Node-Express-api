const Converter = require("csvtojson").Converter;
const fs = require("fs");

function order(result, orderby, direction, callback) {
    var new_result;
    if (direction == 'asc')
        new_result = result.sort(function(a, b) {
            var A = a[orderby].toLowerCase();
            var B = b[orderby].toLowerCase();
            if (A < B)  return -1;
            else return 1;
        });
    else
        new_result = result.sort(function(a, b) {
            var A = a[orderby].toLowerCase();
            var B = b[orderby].toLowerCase();
            if (A < B)  return 1;
            else return -1;
        });
    callback(new_result);
}

function filter(result, criteria, callback) {
    var filtered_result = [];
    var i;
    for (var x in result) {
        i=0;
        for (var key in criteria) {
            if (criteria[key] == result[x][key]) {i++;}
        }
        if (i == Object.keys(criteria).length) {
            filtered_result.push(result[x]);
        }
    }
    callback(filtered_result);
}

function sendResult(res, result) {
    var out = {
        "organizations" : result
        };
    res.send(out);
}

function getData(res, file_path, criteria){
    var converter = new Converter({
        trim:true
    });
    converter.fromFile(file_path, (err, result) => {
        if (err) {
            console.log(err);
            res.send("cannot parse file");
        } else {
            if (result.length == 0){
                  res.send("empty file");
            } else {
                if (typeof criteria === 'undefined' || isEmpty(criteria)) {
                    sendResult(res, result);
                } else {
                    var header = Object.keys(result[0]);
                    var orderby = null;
                    var direction = 'asc';
                    for (var key in criteria) {
                         if (key == 'orderby'){
                             orderby = (header.includes(criteria[key])) ? criteria[key] : null;
                             delete criteria[key];
                         }
                         else if (key == 'direction'){
                             direction = (criteria[key].toLowerCase() == 'dsc') ? 'dsc' : 'asc';
                             delete criteria[key];
                         }
                         else if (!header.includes(key)) {delete criteria[key];}
                    }
                    if (orderby !== null){
                        if (!isEmpty(criteria)){
                            filter(result, criteria, function(new_result) {
                                order(new_result, orderby, direction, function(ordered_result) {
                                    sendResult(res, ordered_result)
                                });
                            });
                        } else {
                            order(result, orderby, direction, function(new_result) {
                                sendResult(res, new_result)
                            });
                        }
                    } else {
                        if (!isEmpty(criteria)){
                            filter(result, criteria, function(new_result) {
                                sendResult(res, new_result)
                            });
                        } else {
                            res.send("specified filtering criteria do not match the header");
                        }
                    }
                }
            }
        }
    });
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

exports.select = (res, select_creteria, file_path) => {
    fs.stat(file_path, function(err) {
        if (err == null) {
            getData(res, file_path, select_creteria)
        } else if(err.code == 'ENOENT') {
            res.send("no such file");
        } else {
            res.send("file access error");
        }
    });
}
