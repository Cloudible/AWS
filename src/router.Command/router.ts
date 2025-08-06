import { awsCommand } from "../command/AWS.command";
import { ec2Command } from "../command/EC2.command";
import { rdsCommand } from "../command/RDS.command";

const commandRouter = [awsCommand, ec2Command, rdsCommand];

export default commandRouter;
