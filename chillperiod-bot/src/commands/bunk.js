import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { createEmbed, Colors, successEmbed, errorEmbed, warningEmbed } from '../utils/embed.js';
import Attendance from '../models/Attendance.js';

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
    
    let attendance = await Attendance.findOne({ discordId: interaction.user.id });
    
    if (!attendance) {
        return interaction.reply({
            embeds: [errorEmbed(
                'No Attendance Data',
                'Set up your attendance first with `/setattendance`!'
            )],
            ephemeral: true
        });
    }
    
    // Check if safe to bunk
    const beforeStatus = attendance.getStatus();
    const beforePercentage = attendance.percentage;
    
    // Update attendance
    if (courseName && attendance.courses.length > 1) {
        // Find specific course
        const course = attendance.courses.find(c => 
            c.name.toLowerCase().includes(courseName.toLowerCase())
        );
        
        if (!course) {
            return interaction.reply({
                embeds: [errorEmbed(
                    'Course Not Found',
                    `Couldn't find course matching "${courseName}".\n\nYour courses: ${attendance.courses.map(c => c.name).join(', ')}`
                )],
                ephemeral: true
            });
        }
        
        course.totalClasses += count;
        attendance.recalculateTotals();
    } else {
        // Quick mode - update first/only course
        if (attendance.courses.length > 0) {
            attendance.courses[0].totalClasses += count;
        }
        attendance.totalClasses += count;
    }
    
    await attendance.save();
    
    // Get new status
    const afterStatus = attendance.getStatus();
    const afterPercentage = attendance.percentage;
    
    // Build response
    let embed;
    const required = attendance.requiredPercentage;
    const safeToBunk = attendance.safeToBunk;
    
    if (afterStatus.status === 'Danger Zone' && beforeStatus.status !== 'Danger Zone') {
        // Just dropped into danger zone
        embed = warningEmbed(
            `🚨 Bunked ${count} Class${count > 1 ? 'es' : ''}!`,
            `⚠️ **ALERT: You've entered the Danger Zone!**\n\n` +
            `${beforePercentage}% → **${afterPercentage}%** (below ${required}%)\n\n` +
            `${afterStatus.message}`
        );
    } else if (afterPercentage <= required + 5 && afterPercentage >= required) {
        // Very close to threshold (within 5%)
        embed = createEmbed({
            title: `⚠️ Bunked ${count} Class${count > 1 ? 'es' : ''} - CAREFUL!`,
            description: `${beforePercentage}% → **${afterPercentage}%**\n\n` +
                `🔔 **You're only ${(afterPercentage - required).toFixed(1)}% above the ${required}% limit!**\n\n` +
                `${safeToBunk > 0 ? `You can only safely bunk **${safeToBunk}** more class${safeToBunk !== 1 ? 'es' : ''}!` : `⚠️ **Don't bunk anymore!** Attend the next class.`}`,
            color: 0xF59E0B, // Amber warning
            footer: 'Use /attendance to see full stats'
        });
    } else if (afterPercentage <= required + 10 && afterPercentage > required + 5) {
        // Approaching threshold (within 10%)
        embed = createEmbed({
            title: `😎 Bunked ${count} Class${count > 1 ? 'es' : ''}`,
            description: `${beforePercentage}% → **${afterPercentage}%**\n\n` +
                `📢 **Heads up:** You're ${(afterPercentage - required).toFixed(1)}% above the ${required}% limit.\n` +
                `Safe to bunk: **${safeToBunk}** more class${safeToBunk !== 1 ? 'es' : ''}.`,
            color: 0xF59E0B, // Amber
            footer: 'Use /attendance to see full stats'
        });
    } else if (afterStatus.status === 'Danger Zone') {
        // Already in danger zone
        embed = warningEmbed(
            `Bunked ${count} Class${count > 1 ? 'es' : ''}`,
            `📛 **You're in the Danger Zone!**\n\n` +
            `${beforePercentage}% → **${afterPercentage}%**\n\n` +
            `${afterStatus.message}`
        );
    } else {
        // Safe zone
        embed = createEmbed({
            title: `😎 Bunked ${count} Class${count > 1 ? 'es' : ''}!`,
            description: `${beforePercentage}% → **${afterPercentage}%**\n\n${afterStatus.emoji} ${afterStatus.message}`,
            color: afterStatus.color,
            footer: 'Use /attendance to see full stats'
        });
    }
    
    await interaction.reply({ embeds: [embed] });
}
