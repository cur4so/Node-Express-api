const Converter = require("csvtojson").Converter;
const fs = require("fs");
const _ = require("lodash");

const sendResult = (res, result) => { res.send({ "organizations" : result }); };

const order = (result, orderby, direction, callback) => { 
    ordered = _.orderBy(result, orderby, [direction]);
    callback(ordered);
};

const filter = (result, criteria, callback) => {
    let filtered_result = [];
    let i;
    for (let x in result) {
        i=0;
        for (let key in criteria) {
            if (criteria[key] == result[x][key]) {i++;}
        }
        if (i == Object.keys(criteria).length) {
            filtered_result.push(result[x]);
        }
    }
    callback(filtered_result);
};

const getData = (res, file_path, criteria) => {
    let converter = new Converter({
        trim: true
    });
    converter.fromFile(file_path, (err, result) => {
        if (err) {
            console.log(err);
            res.send("cannot parse file");
        } else {
            if (result.length == 0){
                  res.send("empty file");
            } else {
                if (typeof criteria === 'undefined' || _.isEmpty(criteria)) {
                    sendResult(res, result);
                } else {
                    let header = Object.keys(result[0]);
                    let orderby = null;
                    let direction = 'asc';
                    for (let key in criteria) {
                         if (key == 'orderby'){
                             orderby = (header.indexOf(criteria[key]) > -1) ? criteria[key] : null;
                             delete criteria[key];
                         }
                         else if (key == 'direction'){
                             direction = (criteria[key].toLowerCase() == 'dsc') ? 'desc' : 'asc';
                             delete criteria[key];
                         }
                         else if (header.indexOf(key) == -1) {delete criteria[key];}
                    }
                    if (orderby !== null){
                        if (! _.isEmpty(criteria)){
                            filter(result, criteria, (new_result) => {
                                order(new_result, orderby, direction, (ordered_result) => {
                                    sendResult(res, ordered_result)
                                });
                            });
                        } else {
                            order(result, orderby, direction, (new_result) => {
                                sendResult(res, new_result)
                            });
                        }
                    } else {
                        if (!_.isEmpty(criteria)){
                            filter(result, criteria, (new_result) => {
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

exports.select = (res, select_creteria, file_path) => {
    fs.stat(file_path, (err) => {
        if (err == null) {
            getData(res, file_path, select_creteria)
        } else if(err.code == 'ENOENT') {
            res.send("no such file");
        } else {
            res.send("file access error");
        }
    });
}
