import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if ChillPeriod bot is responding');

export async function execute(interaction) {
    const sent = await interaction.deferReply({ fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);
    
    const embed = createEmbed({
        title: '🏓 Pong!',
        description: 'ChillPeriod is online and ready!',
        color: Colors.SUCCESS,
        fields: [
            {
                name: 'Bot Latency',
                value: `\`${latency}ms\``,
                inline: true,
            },
            {
                name: 'API Latency',
                value: `\`${apiLatency}ms\``,
                inline: true,
            },
        ],
        footer: 'ChillPeriod • Your campus companion',
    });
    
    await interaction.editReply({ embeds: [embed] });
}
