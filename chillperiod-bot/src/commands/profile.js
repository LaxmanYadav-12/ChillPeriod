import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors, errorEmbed } from '../utils/embed.js';
import User from '../models/User.js';

export const data = new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your or another user\'s attendance profile')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('View someone else\'s profile (optional)')
            .setRequired(false));

export async function execute(interaction) {
    const targetDiscordUser = interaction.options.getUser('user') || interaction.user;
    const isSelf = targetDiscordUser.id === interaction.user.id;
    
    const user = await User.findOne({ discordId: targetDiscordUser.id });

    if (!user) {
        return interaction.reply({
            embeds: [errorEmbed(
                'User Not Found',
                isSelf 
                    ? 'You haven\'t set up your profile yet! Use `/addcourse` to get started.'
                    : `${targetDiscordUser.username} hasn't set up their ChillPeriod profile yet.`
            )],
            ephemeral: true
        });
    }

    // Check privacy
    if (!isSelf && !user.isPublic) {
        return interaction.reply({
            embeds: [errorEmbed(
                'Private Profile',
                `${targetDiscordUser.username}'s profile is set to private. 🔒`
            )],
            ephemeral: true
        });
    }

    const percentage = user.attendancePercentage;
    const bunkTitle = user.getBunkTitle();
    const safeToSkip = user.safeToSkip;

    // Status indicator
    let statusEmoji = '🟢';
    let statusText = 'Safe Zone';
    let statusColor = Colors.SUCCESS;
    const target = user.targetPercentage || 75;

    if (percentage < target) {
        statusEmoji = '🔴';
        statusText = 'Danger Zone';
        statusColor = Colors.DANGER;
    } else if (percentage < target + 5) {
        statusEmoji = '🟡';
        statusText = 'Caution Zone';
        statusColor = Colors.WARNING;
    }

    // Progress bar
    const totalBlocks = 20;
    const filledBlocks = Math.round((percentage / 100) * totalBlocks);
    let bar = '';
    for (let i = 0; i < totalBlocks; i++) {
        bar += i < filledBlocks ? (percentage >= target ? '🟩' : '🟨') : '⬜';
    }

    // Course breakdown
    let courseText = 'No courses added yet.';
    if (user.courses && user.courses.length > 0) {
        courseText = user.courses.slice(0, 8).map(c => {
            const pct = c.totalClasses > 0 ? Math.round((c.attendedClasses / c.totalClasses) * 100) : 100;
            const courseStatus = user.getCourseStatus(c);
            const typeLabel = c.type === 'Lab' ? ' 🔬' : '';
            return `${courseStatus.emoji} **${c.name}**${typeLabel}: ${c.attendedClasses}/${c.totalClasses} (${pct}%)`;
        }).join('\n');
        
        if (user.courses.length > 8) {
            courseText += `\n*...and ${user.courses.length - 8} more*`;
        }
    }

    const embed = createEmbed({
        title: `${statusEmoji} ${isSelf ? 'Your' : targetDiscordUser.username + "'s"} Profile`,
        description: `**${user.name || user.username}** • Lv ${user.level || 1} (${user.xp || 0} XP)\n${bunkTitle.emoji} ${bunkTitle.title}\n\n**Attendance: ${percentage}%**\n${bar}`,
        color: statusColor,
        thumbnail: targetDiscordUser.displayAvatarURL({ dynamic: true }),
        fields: [
            {
                name: '📊 Stats',
                value: 
                    `Classes: **${user.attendedClasses}/${user.totalClasses}**\n` +
                    `Bunks: **${user.totalBunks}**\n` +
                    `Safe to Skip: **${safeToSkip}**`,
                inline: true
            },
            {
                name: '🔥 Streaks',
                value: 
                    `Current: **${user.currentStreak}** days\n` +
                    `Longest: **${user.longestStreak}** days\n` +
                    `Target: **${target}%**`,
                inline: true
            },
            {
                name: '👥 Social',
                value: 
                    `Followers: **${user.followerCount}**\n` +
                    `Following: **${user.followingCount}**`,
                inline: true
            },
            {
                name: '📚 Courses',
                value: courseText,
                inline: false
            }
        ],
        footer: user.college ? `${user.college} • Semester ${user.semester || '?'}` : 'ChillPeriod'
    });

    if (user.favoriteSpot?.name) {
        embed.addFields({
            name: '📍 Favorite Spot',
            value: `${user.favoriteSpot.emoji || '📍'} ${user.favoriteSpot.name}`,
            inline: false
        });
    }

    await interaction.reply({ embeds: [embed] });
}
