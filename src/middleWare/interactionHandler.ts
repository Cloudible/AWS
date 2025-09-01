import { ChatInputCommandInteraction, MessageFlags } from "discord.js";

/**
 * 긴 작업을 위한 인터랙션 핸들러
 * Discord의 3초 타임아웃을 방지하기 위해 즉시 응답하고 나중에 업데이트
 */
export class InteractionHandler {
    private interaction: ChatInputCommandInteraction;
    private hasReplied: boolean = false;

    constructor(interaction: ChatInputCommandInteraction) {
        this.interaction = interaction;
    }

    /**
     * 즉시 응답하여 인터랙션 만료 방지
     */
    async replyImmediately(content: string): Promise<void> {
        if (!this.hasReplied) {
            await this.interaction.reply({
                content,
                flags: MessageFlags.SuppressEmbeds
            });
            this.hasReplied = true;
        }
    }

    /**
     * 응답 메시지 업데이트
     */
    async updateReply(content: string): Promise<void> {
        if (this.hasReplied) {
            await this.interaction.editReply({
                content,
                flags: MessageFlags.SuppressEmbeds
            });
        } else {
            await this.replyImmediately(content);
        }
    }

    /**
     * 에러 메시지로 업데이트
     */
    async updateWithError(error: any, context: string = ""): Promise<void> {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const content = `❌ ${context} 실패\n\n**오류:** ${errorMessage}\n\n**해결 방법:**\n1. 자격 증명이 올바른지 확인하세요\n2. 필요한 권한이 있는지 확인하세요\n3. 네트워크 연결을 확인하세요`;
        
        await this.updateReply(content);
    }

    /**
     * 성공 메시지로 업데이트
     */
    async updateWithSuccess(content: string): Promise<void> {
        await this.updateReply(`✅ ${content}`);
    }

    /**
     * 진행 중 메시지로 업데이트
     */
    async updateWithProgress(content: string): Promise<void> {
        await this.updateReply(`🔄 ${content}\n\n잠시만 기다려주세요...`);
    }

    /**
     * 인터랙션이 이미 응답되었는지 확인
     */
    get replied(): boolean {
        return this.hasReplied;
    }
}

/**
 * 긴 작업을 안전하게 실행하는 래퍼 함수
 */
export async function safeExecuteLongTask(
    interaction: ChatInputCommandInteraction,
    task: () => Promise<any>,
    initialMessage: string,
    successMessage: string,
    context: string = "작업"
): Promise<void> {
    const handler = new InteractionHandler(interaction);
    
    try {
        // 즉시 응답
        await handler.replyImmediately(initialMessage);
        
        // 작업 실행
        await task();
        
        // 성공 메시지
        await handler.updateWithSuccess(successMessage);
        
    } catch (error) {
        // 에러 메시지
        await handler.updateWithError(error, context);
    }
}
