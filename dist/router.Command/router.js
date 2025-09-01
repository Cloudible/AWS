"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS_command_1 = require("../command/AWS.command");
const EC2_command_1 = require("../command/EC2.command");
const VPC_command_1 = require("../command/VPC.command");
const RDS_command_1 = require("../command/RDS.command");
const commandRouter = [AWS_command_1.awsCommand, EC2_command_1.ec2Command, VPC_command_1.vpcCommand, RDS_command_1.rdsCommand];
exports.default = commandRouter;
