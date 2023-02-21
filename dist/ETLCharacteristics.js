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
exports.seedCharacteristics = void 0;
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
const Characteristics_1 = require("./Characteristics");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const app_2 = require("./app");
const characteristicsPath = '../csv/characteristics.csv';
const parseCharacteristics = () => {
    const tempStorage = [];
    const stream = fs_1.default.createReadStream(characteristicsPath);
    const header = { header: true };
    const parsedStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, header);
    stream.pipe(parsedStream);
    parsedStream.on('data', (row) => {
        const obj = {
            id: Number(row.id),
            'product_id': Number(row.product_id),
            name: String(row.name)
        };
        tempStorage.push(obj);
    });
    parsedStream.on('end', () => {
        Characteristics_1.Characteristics.insertMany(tempStorage);
        console.log('first data: ', tempStorage[0]);
        console.log('finished parsing csv file');
    });
};
const seedCharacteristics = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default.connect(app_1.url, { dbName: app_2.dbName })
        .then(() => {
        console.log('connected to db');
        parseCharacteristics();
    })
        .catch((err) => {
        console.log(err);
    });
});
exports.seedCharacteristics = seedCharacteristics;
//# sourceMappingURL=ETLCharacteristics.js.map