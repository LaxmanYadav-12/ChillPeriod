import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors } from '../utils/embed.js';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get information about ChillPeriod bot and its commands');

export async function execute(interaction) {
    const embed = createEmbed({
        title: '🎯 ChillPeriod Bot',
        description: 'Your student-centric companion for tracking attendance, finding chill spots, and coordinating mass bunks!',
        color: Colors.PRIMARY,
        fields: [
            {
                name: '📊 Attendance Tracker',
                value: 
                    '`/addcourse` - Add a course to track\n' +
                    '`/removecourse` - Remove a course\n' +
                    '`/attend` - Mark a class as attended\n' +
                    '`/bunk` - Mark a class as bunked\n' +
                    '`/attendance` - View your attendance dashboard\n' +
                    '`/setattendance` - Set attendance manually',
                inline: false,
            },
            {
                name: '🚨 Social & Bunking',
                value: 
                    '`/massbunk` - Announce a mass bunk alert\n' +
                    '`/leaderboard` - View top bunkers\n' +
                    '`/profile` - View your or someone\'s profile\n' +
                    '`/excuse` - Generate a random excuse',
                inline: false,
            },
            {
                name: '📍 Chill Spots',
                value: 
                    '`/addspot` - Add a new chill spot\n' +
                    '`/findspots` - Find nearby spots\n' +
                    '`/spotinfo` - Get details about a spot',
                inline: false,
            },
            {
                name: '🔧 Utility',
                value: 
                    '`/setcollege` - Set your college\n' +
                    '`/ping` - Check bot latency\n' +
                    '`/help` - Show this message',
                inline: false,
            },
        ],
        footer: 'ChillPeriod • Making free periods count! • chillperiod.in',
    });
    
    await interaction.reply({ embeds: [embed] });
}
