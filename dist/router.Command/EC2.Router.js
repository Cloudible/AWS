"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EC2_command_1 = require("../command/EC2.command");
const AWS_command_1 = require("../command/AWS.command");
const commandRouter = [EC2_command_1.ec2Command, AWS_command_1.awsCommand];
exports.default = commandRouter;
