import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors, errorEmbed } from '../utils/embed.js';
import User from '../models/User.js';

export const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the top bunkers leaderboard');

export async function execute(interaction) {
    const currentUser = await User.findOne({ discordId: interaction.user.id });
    
    // Build query - filter by college if user has one set
    const query = {};
    if (currentUser?.college) {
        query.college = currentUser.college;
    }

    const topBunkers = await User.find({ ...query, totalBunks: { $gt: 0 } })
        .sort({ totalBunks: -1 })
        .limit(10)
        .select('name username discordId totalBunks totalClasses attendedClasses');

    if (topBunkers.length === 0) {
        return interaction.reply({
            embeds: [errorEmbed(
                'No Bunkers Yet',
                'Nobody has bunked any classes yet! Be the first rebel. 😈\n\nUse `/bunk` to get started.'
            )],
            ephemeral: true
        });
    }

    const medals = ['🥇', '🥈', '🥉'];
    
    let leaderboardText = topBunkers.map((user, index) => {
        const rank = index < 3 ? medals[index] : `**${index + 1}.**`;
        const bunkTitle = getBunkTitle(user.totalBunks);
        const percentage = user.totalClasses > 0 
            ? Math.round((user.attendedClasses / user.totalClasses) * 100) 
            : 100;
        const displayName = user.name || user.username || 'Anonymous';
        const isCurrentUser = currentUser && user.discordId === currentUser.discordId;
        
        return `${rank} ${isCurrentUser ? '**→ ' : ''}${bunkTitle.emoji} ${displayName} — **${user.totalBunks}** bunks (${percentage}%)${isCurrentUser ? ' ←**' : ''}`;
    }).join('\n');

    // Find current user's rank if not in top 10
    let footerText = 'Use /bunk to climb the leaderboard!';
    if (currentUser && !topBunkers.find(u => u.discordId === currentUser.discordId)) {
        const rank = await User.countDocuments({ 
            ...query, 
            totalBunks: { $gt: currentUser.totalBunks || 0 } 
        }) + 1;
        footerText = `Your rank: #${rank} with ${currentUser.totalBunks || 0} bunks`;
    }

    const embed = createEmbed({
        title: '🏆 Bunk Leaderboard',
        description: currentUser?.college 
            ? `Top bunkers at **${currentUser.college}**\n\n${leaderboardText}`
            : `Top bunkers globally\n\n${leaderboardText}`,
        color: Colors.WARNING,
        footer: footerText
    });

    await interaction.reply({ embeds: [embed] });
}

function getBunkTitle(bunks) {
    if (bunks >= 100) return { title: 'Bunk Legend', emoji: '👑' };
    if (bunks >= 50) return { title: 'Bunk King', emoji: '🏆' };
    if (bunks >= 25) return { title: 'Serial Skipper', emoji: '😴' };
    if (bunks >= 10) return { title: 'Chill Master', emoji: '😎' };
    if (bunks >= 5) return { title: 'Casual Bunker', emoji: '🌴' };
    return { title: 'Rookie', emoji: '🌱' };
}
