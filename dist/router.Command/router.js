"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS_command_1 = require("../command/AWS.command");
// import { ec2Command } from "../command/EC2.command";
// import { rdsCommand } from "../command/RDS.command";
// const commandRouter = [awsCommand, ec2Command, rdsCommand];
const commandRouter = [AWS_command_1.awsCommand];
exports.default = commandRouter;
