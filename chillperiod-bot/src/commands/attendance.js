import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors, errorEmbed } from '../utils/embed.js';
import User from '../models/User.js';

export const data = new SlashCommandBuilder()
    .setName('attendance')
    .setDescription('View your attendance stats and safe-to-bunk status');

export async function execute(interaction) {
    let user = await User.findOne({ discordId: interaction.user.id });
    
    if (!user || !user.courses || user.courses.length === 0) {
        return interaction.reply({
            embeds: [errorEmbed(
                'No Attendance Data',
                'You haven\'t set up attendance tracking yet!\n\nUse `/addcourse` to add your courses.'
            )],
            ephemeral: true
        });
    }
    
    // Get status info
    const percentage = user.attendancePercentage;
    const safeToSkip = user.safeToSkip;
    const bunkTitle = user.getBunkTitle(); // e.g. "Rookie", "Bunk King"
    
    // Status text based on global percentage (using 75% as default reference)
    let statusEmoji = '🟢';
    let statusText = 'Safe Zone';
    let statusMessage = `You can safely bunk ${safeToSkip} more classes overall.`;
    let statusColor = Colors.SUCCESS;

    if (percentage < 75) {
        statusEmoji = '🔴';
        statusText = 'Danger Zone';
        statusMessage = `You are below 75%! Attend classes to catch up.`;
        statusColor = Colors.ERROR;
    } else if (percentage < 80) {
        statusEmoji = '🟡';
        statusText = 'Caution Zone';
        statusMessage = `You are close to the edge!`;
        statusColor = Colors.WARNING;
    }
    
    // Build progress bar
    const progressBar = buildProgressBar(percentage, 75);
    
    // Build course breakdown
    let courseBreakdown = '';
    courseBreakdown = user.courses.map(course => {
        const stats = user.getCourseStatus(course);
        const pct = course.totalClasses > 0 
            ? Math.round((course.attendedClasses / course.totalClasses) * 100) 
            : 100;
        return `${stats.emoji} **${course.name}**: ${course.attendedClasses}/${course.totalClasses} (${pct}%)`;
    }).join('\n');
    
    const embed = createEmbed({
        title: `${statusEmoji} Attendance Dashboard`,
        description: `**Overall: ${percentage}%**\n${progressBar}\n\n${statusMessage}`,
        color: statusColor,
        fields: [
            {
                name: '📊 Stats',
                value: `Classes Attended: **${user.attendedClasses}/${user.totalClasses}**\nBunks: **${user.totalBunks}**`,
                inline: true
            },
            {
                name: `${bunkTitle.emoji} Rank`,
                value: `**${bunkTitle.title}**\nStreak: ${user.currentStreak} days`,
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
