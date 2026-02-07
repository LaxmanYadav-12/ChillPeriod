import { SlashCommandBuilder } from 'discord.js';
import { successEmbed, errorEmbed } from '../utils/embed.js';
import User from '../models/User.js';

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
            .setMaxValue(1000));

export async function execute(interaction) {
    const total = interaction.options.getInteger('total');
    const attended = interaction.options.getInteger('attended');
    
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
    
    // Update or create user record
    // We clear courses because this is a "quick set" that overrides detailed tracking
    const user = await User.findOneAndUpdate(
        { discordId: interaction.user.id },
        {
            discordId: interaction.user.id,
            username: interaction.user.username,
            name: interaction.user.username,
            totalClasses: total,
            attendedClasses: attended,
            // Clear courses when using quick setup to avoid sync conflicts
            courses: [{
                name: 'All Classes',
                totalClasses: total,
                attendedClasses: attended,
                targetPercentage: 75
            }]
        },
        { upsert: true, new: true }
    );
    
    const percentage = user.attendancePercentage;
    let statusEmoji = '🟢';
    let statusMsg = 'You set your attendance!';
    
    if (percentage < 75) statusEmoji = '🔴';
    
    await interaction.reply({
        embeds: [successEmbed(
            'Attendance Set!',
            `**Current: ${percentage}%** (${attended}/${total})\n\n${statusEmoji} Updated successfully!\n\nUse \`/attendance\` to view your dashboard!`
        )]
    });
}
