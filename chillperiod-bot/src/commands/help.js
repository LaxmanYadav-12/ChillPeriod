import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get information about ChillPeriod bot and its commands');

export async function execute(interaction) {
    const embed = createEmbed({
        title: '🎯 ChillPeriod Bot',
        description: 'Your student-centric companion for finding chill spots, tracking attendance, and connecting with peers during free periods!',
        color: Colors.PRIMARY,
        fields: [
            {
                name: '📍 Chill Spots (Coming Soon)',
                value: '`/addspot` - Add a new chill spot\n`/findspots` - Find nearby spots\n`/spotinfo` - Get details about a spot',
                inline: false,
            },
            {
                name: '📊 Attendance Tracker (Coming Soon)',
                value: '`/setattendance` - Set your attendance info\n`/checkattendance` - Check if safe to skip\n`/attendance` - View your stats',
                inline: false,
            },
            {
                name: '💬 Community (Coming Soon)',
                value: '`/review` - Review a spot\n`/upvote` - Upvote a spot\n`/report` - Report inappropriate content',
                inline: false,
            },
            {
                name: '🔧 Utility',
                value: '`/ping` - Check bot latency\n`/help` - Show this message',
                inline: false,
            },
        ],
        footer: 'ChillPeriod • Making free periods count!',
    });
    
    await interaction.reply({ embeds: [embed] });
}
