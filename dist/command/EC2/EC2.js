"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ec2State = void 0;
const discord_js_1 = require("discord.js");
exports.ec2State = {
    name: "ec2-status-check",
    description: "EC2 상태 확인",
    options: [
        {
            name: "state",
            description: "EC2 상태를 확인 합니다. (run/stop)",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "실행",
                    value: "run"
                },
                {
                    name: "중지",
                    value: "stop"
                }
            ]
        }
    ],
    execute: async (client, interaction) => {
        const state = interaction.options.getString("state"); // state에 나중에 실제 instance의 실행 값을 불러오는 로직을 작성 후 대입할 것
        await interaction.reply(`EC2 상태 : ${state}`);
    }
};
