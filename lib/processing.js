const Converter = require("csvtojson").Converter;

function order(result, orderby, direction, callback){
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

function getData(res, criteria){
    var converter = new Converter({
        trim:true
    });
    // file name/path can be a parameter sent to the function
    // in case diferent files may be on demand
    // or it can be specified in conig if it is static
    // in production code the files are not hardcoded
    converter.fromFile("./organization_sample_data.csv", (err, result) => {
        if (err) {
            console.log(err);
            res.send("cannot parse file");
        } else {
            if (result.length == 0){
                  res.send("empty file");
            } else {
            if (typeof criteria === 'undefined') {
                  var out = {
                      "organizations" : result
                      };
                  res.send(out);
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
                                var out = {
                                    "organizations" : ordered_result
                                };
                                res.send(out);
                            });
                        });
                    } else {
                        order(result, orderby, direction, function(new_result) {
                            var out = {
                                "organizations" : new_result
                            };
                            res.send(out);
                        });
                    }
                } else {
                    if (!isEmpty(criteria)){
                        filter(result, criteria, function(new_result) {
                            var out = {
                                "organizations" : new_result
                            };
                            res.send(out);
                        });
                    } else {
                        res.send("specified filtering creteria do not match the header");
                    }
                }
            }
        }}
    });
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

exports.select = (res, select_creteria) => {
    if (isEmpty(select_creteria)) {
        getData(res);
    } else {
        getData(res, select_creteria);
    }
}
