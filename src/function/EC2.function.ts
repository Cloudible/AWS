import AWS from "aws-sdk";

export const ec2 = new AWS.EC2({
    region: process.env.AWS_REGION || "ap-northeast-2"
});