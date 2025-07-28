import { ec2Command } from "../command/EC2.command";
import { awsCommand } from "../command/AWS.command";

const commandRouter = [ec2Command, awsCommand];

export default commandRouter; 