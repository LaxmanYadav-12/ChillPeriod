import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors, errorEmbed } from '../utils/embed.js';
import Attendance from '../models/Attendance.js';

export const data = new SlashCommandBuilder()
    .setName('attendance')
    .setDescription('View your attendance stats and safe-to-bunk status');

export async function execute(interaction) {
    let attendance = await Attendance.findOne({ discordId: interaction.user.id });
    
    if (!attendance) {
        return interaction.reply({
            embeds: [errorEmbed(
                'No Attendance Data',
                'You haven\'t set up attendance tracking yet!\n\nUse `/addcourse` to add your courses, or `/setattendance` for quick setup.'
            )],
            ephemeral: true
        });
    }
    
    // Get status info
    const status = attendance.getStatus();
    const percentage = attendance.percentage;
    
    // Build progress bar
    const progressBar = buildProgressBar(percentage, attendance.requiredPercentage);
    
    // Build course breakdown
    let courseBreakdown = '';
    if (attendance.courses.length > 0) {
        courseBreakdown = attendance.courses.map(course => {
            const pct = course.totalClasses > 0 
                ? Math.round((course.attendedClasses / course.totalClasses) * 100) 
                : 100;
            const icon = pct >= attendance.requiredPercentage ? '✅' : '⚠️';
            return `${icon} **${course.name}**: ${course.attendedClasses}/${course.totalClasses} (${pct}%)`;
        }).join('\n');
    }
    
    const embed = createEmbed({
        title: `${status.emoji} Attendance Dashboard`,
        description: `**Overall: ${percentage}%**\n${progressBar}\n\n${status.message}`,
        color: status.color,
        fields: [
            {
                name: '📊 Stats',
                value: `Classes Attended: **${attendance.attendedClasses}/${attendance.totalClasses}**\nRequired: **${attendance.requiredPercentage}%**`,
                inline: true
            },
            {
                name: `${status.emoji} Status`,
                value: `**${status.status}**\n${attendance.safeToBunk > 0 ? `Safe to bunk: **${attendance.safeToBunk}**` : attendance.needToAttend > 0 ? `Need to attend: **${attendance.needToAttend}**` : 'Right on the edge!'}`,
                inline: true
            }
        ],
        footer: 'Use /bunk or /attend to update • /addcourse to add courses'
    });
    
    if (courseBreakdown) {
        embed.addFields({ name: '📚 By Course', value: courseBreakdown, inline: false });
    }
    
    await interaction.reply({ embeds: [embed] });
}

function buildProgressBar(current, required) {
    const totalBlocks = 20;
    const filledBlocks = Math.round((current / 100) * totalBlocks);
    const requiredMark = Math.round((required / 100) * totalBlocks);
    
    let bar = '';
    for (let i = 0; i < totalBlocks; i++) {
        if (i < filledBlocks) {
            bar += current >= required ? '🟩' : '🟨';
        } else {
            bar += '⬜';
        }
    }
    
    return bar;
}
