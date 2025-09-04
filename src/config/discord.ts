import {
  ChatInputCommandInteraction,
  Client,
  Interaction,
  GatewayIntentBits,
  AutocompleteInteraction,
} from "discord.js";
import dotenv from "dotenv";
import commandRouter from "../router.Command/router";
import * as EC2 from "../command/EC2.command";
import * as VPC from "../command/VPC.command";
import * as RDS from "../command/RDS.command";

dotenv.config();

const Token = process.env.DISCORD_TOKEN;

// 토큰 검증
if (!Token) {
  console.error("❌ DISCORD_TOKEN이 설정되지 않았습니다!");
  console.error("📝 .env 파일에 DISCORD_TOKEN을 추가해주세요.");
  process.exit(1);
}

const client = new Client({
  // 봇 권한 설정
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ready 이벤트 리스너를 로그인 전에 등록
client.on("ready", async () => {
  console.log(`🤖 봇이 준비되었습니다: ${client.user?.tag}`);
  
  if (client.application) {
    try {
      console.log("📝 등록할 명령어 목록:");
      commandRouter.forEach((cmd) => {
        console.log(`- ${cmd.name}: ${cmd.description}`);
        if (cmd.options) {
          cmd.options.forEach((option: any) => {
            console.log(
              `  └─ ${option.name}: ${option.description}`
            );
          });
        }
      });

      console.log("🔄 Slash commands 등록 중...");
      await client.application.commands.set(commandRouter);
      console.log("✅ Slash commands registered successfully");
    } catch (error) {
      console.error("❌ Slash commands 등록 실패:", error);
      console.error("🔍 다음 사항을 확인해주세요:");
      console.error("1. Discord 봇 토큰이 올바른지 확인");
      console.error("2. 봇이 'applications.commands' 권한을 가지고 있는지 확인");
      console.error("3. 봇이 서버에 올바르게 초대되었는지 확인");
    }
  } else {
    console.error("❌ client.application이 null입니다. 봇 권한을 확인해주세요.");
  }
});

// interactionCreate 이벤트 리스너를 로그인 전에 등록
client.on(
  "interactionCreate",
  async (interaction: Interaction) => {
    if(interaction.isAutocomplete()) {
      if(interaction.commandName === "ec2" && EC2.ec2Command.autocomplete) {
        await EC2.ec2Command.autocomplete(interaction);
      } else if(interaction.commandName === "vpc" && VPC.vpcCommand.autocomplete) {
        await VPC.vpcCommand.autocomplete(interaction);
      } else if(interaction.commandName === "rds" && RDS.rdsCommand.autocomplete) {
        await RDS.rdsCommand.autocomplete(interaction);
      }
      return;
    }

    if (interaction.isCommand()) {
      const currentCommand = commandRouter.find(
        (command) => command.name === interaction.commandName
      );
      
      if (currentCommand) {
        console.log(`✅ 명령어 찾음: ${currentCommand.name}`);
        try {
          await currentCommand.execute(
            client,
            interaction as ChatInputCommandInteraction
          );
        } catch (error) {
          console.error(`❌ 명령어 실행 중 오류 발생:`, error);
        }
      } else {
        console.log(`❌ 명령어를 찾을 수 없음: ${interaction.commandName}`);
        console.log(`📋 사용 가능한 명령어:`, commandRouter.map(cmd => cmd.name));
      }
    }
  }
);

const startDiscordBot = async () => {
  try {
    console.log("🔐 Discord 봇 로그인 시도 중...");
    await client.login(Token);
    console.log("✅ Discord bot is running");
  } catch (error) {
    console.error("❌ Discord 봇 로그인 실패:", error);
    process.exit(1);
  }
};

export default startDiscordBot;
