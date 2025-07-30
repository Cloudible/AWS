"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ec2 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
exports.ec2 = new aws_sdk_1.default.EC2({
    region: process.env.AWS_REGION || "ap-northeast-2"
});
