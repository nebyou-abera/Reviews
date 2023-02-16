"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const papaparse_1 = __importDefault(require("papaparse"));
const fs_1 = __importDefault(require("fs"));
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const filePath = '../reviews_test.csv';
const readCsv = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const file = fs_1.default.createReadStream(filePath);
    console.log('streaming csv file from path: ', filePath);
    // use a promise and papaparse to stream file and insert into db. 
    return new Promise((resolve, reject) => {
        papaparse_1.default.parse(file, {
            worker: true,
            header: true,
            dynamicTyping: true,
            step: function (row) {
                // console.log('Row:', row.data);
            },
            complete: function (results, file) {
                console.log('All done!');
                console.log('results: ', results.data);
                console.log(results);
                resolve(results.data);
            },
            error: function (err, file) {
                reject(err);
            }
        });
    });
});
readCsv(filePath)
    .then((data) => {
    console.log('successful parsed data from csv file: ', data);
})
    .catch((err) => {
    console.log('error from csv file: ', err);
});
/* Install node-mongodb-native by doing:
 *  npm install mongodb
 * See documentation at https://github.com/mongodb/node-mongodb-native
 * Run this command in the terminal to launch mongo server:
 *  mongod --dbpath=/data --port 27017
 * Run this file with:
 *  node mongo-example.js
 */
//connect to mongodb and insert data using mongoose and readCsv function
const insertData = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'mongodb://localhost:27017/test';
});
//# sourceMappingURL=etl.js.map