import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors, warningEmbed, errorEmbed } from '../utils/embed.js';
import User from '../models/User.js';

export const data = new SlashCommandBuilder()
    .setName('bunk')
    .setDescription('Mark a class as bunked (skipped)')
    .addStringOption(option =>
        option.setName('course')
            .setDescription('Which course? (leave empty if using quick mode)')
            .setRequired(false)
            .setMaxLength(50))
    .addIntegerOption(option =>
        option.setName('count')
            .setDescription('How many classes bunked? (default: 1)')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(10));

export async function execute(interaction) {
    const courseName = interaction.options.getString('course');
    const count = interaction.options.getInteger('count') || 1;
    
    let user = await User.findOne({ discordId: interaction.user.id });
    
    if (!user || user.courses.length === 0) {
        return interaction.reply({
            embeds: [errorEmbed(
                'No Attendance Data',
                'Set up your attendance first with `/addcourse`!'
            )],
            ephemeral: true
        });
    }
    
    const beforePercentage = user.attendancePercentage;
    let targetCourse = null;
    
    // Update attendance
    if (courseName && user.courses.length > 1) {
        // Find specific course
        targetCourse = user.courses.find(c => 
            c.name.toLowerCase().includes(courseName.toLowerCase())
        );
        
        if (!targetCourse) {
            return interaction.reply({
                embeds: [errorEmbed(
                    'Course Not Found',
                    `Couldn't find course matching "${courseName}".\n\nYour courses: ${user.courses.map(c => c.name).join(', ')}`
                )],
                ephemeral: true
            });
        }
    } else {
        // Quick mode - update first/only course
        if (user.courses.length > 0) {
            targetCourse = user.courses[0];
        }
    }
    
    if (targetCourse) {
        targetCourse.totalClasses += count;
        // Do NOT increment attendedClasses
        
        // Log this action
        const today = new Date().toISOString().split('T')[0];
        let todayLog = user.attendanceLog.find(l => l.date === today);
        if (!todayLog) {
            user.attendanceLog.push({ date: today, actions: [] });
            todayLog = user.attendanceLog[user.attendanceLog.length - 1];
        }
        
        // Add action for each count
        for(let i=0; i<count; i++) {
            todayLog.actions.push({
                courseId: targetCourse._id,
                status: 'bunked'
            });
        }
    }

    // Update global stats
    user.totalClasses = user.courses.reduce((sum, c) => sum + c.totalClasses, 0);
    user.attendedClasses = user.courses.reduce((sum, c) => sum + c.attendedClasses, 0);
    user.totalBunks += count;
    user.currentStreak = 0; // Reset streak on bunk

    await user.save();
    
    // Get new status
    const afterPercentage = user.attendancePercentage;
    const required = 75;
    
    let embed;
    if (afterPercentage < required && beforePercentage >= required) {
        embed = warningEmbed(
            `🚨 Bunked ${count} Class${count > 1 ? 'es' : ''}!`,
            `⚠️ **ALERT: You've entered the Danger Zone!**\n\n` +
            `${beforePercentage}% → **${afterPercentage}%** (below ${required}%)\n\n` +
            `Attend your next classes!`
        );
    } else {
        embed = createEmbed({
            title: `😴 Bunked ${count} Class${count > 1 ? 'es' : ''}!`,
            description: `${beforePercentage}% → **${afterPercentage}%**\n\nTake a chill pill! 💊`,
            color: Colors.WARNING,
            footer: 'Use /attendance to see full stats'
        });
    }
    
    await interaction.reply({ embeds: [embed] });
}
