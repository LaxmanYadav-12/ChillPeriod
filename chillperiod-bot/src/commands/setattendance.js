import { SlashCommandBuilder } from 'discord.js';
import { successEmbed, errorEmbed } from '../utils/embed.js';
import Attendance from '../models/Attendance.js';

export const data = new SlashCommandBuilder()
    .setName('setattendance')
    .setDescription('Quick setup - set your overall attendance')
    .addIntegerOption(option =>
        option.setName('total')
            .setDescription('Total number of classes held so far')
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(1000))
    .addIntegerOption(option =>
        option.setName('attended')
            .setDescription('Number of classes you\'ve attended')
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(1000))
    .addIntegerOption(option =>
        option.setName('required')
            .setDescription('Required attendance percentage (default: 75)')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(100));

export async function execute(interaction) {
    const total = interaction.options.getInteger('total');
    const attended = interaction.options.getInteger('attended');
    const required = interaction.options.getInteger('required') || 75;
    
    // Validate
    if (attended > total) {
        return interaction.reply({
            embeds: [errorEmbed(
                'Invalid Input',
                'Attended classes cannot be more than total classes!'
            )],
            ephemeral: true
        });
    }
    
    // Update or create attendance record
    const attendance = await Attendance.findOneAndUpdate(
        { discordId: interaction.user.id },
        {
            discordId: interaction.user.id,
            username: interaction.user.username,
            totalClasses: total,
            attendedClasses: attended,
            requiredPercentage: required,
            // Clear courses when using quick setup
            courses: [{
                name: 'All Classes',
                totalClasses: total,
                attendedClasses: attended
            }]
        },
        { upsert: true, new: true }
    );
    
    const percentage = attendance.percentage;
    const status = attendance.getStatus();
    
    await interaction.reply({
        embeds: [successEmbed(
            'Attendance Set!',
            `**Current: ${percentage}%** (${attended}/${total})\n**Required: ${required}%**\n\n${status.emoji} ${status.message}\n\nUse \`/attendance\` to view your dashboard!`
        )]
    });
}
