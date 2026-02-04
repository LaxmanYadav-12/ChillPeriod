import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createEmbed, Colors, errorEmbed, warningEmbed } from '../utils/embed.js';
import Spot from '../models/Spot.js';
import User from '../models/User.js';

export const data = new SlashCommandBuilder()
    .setName('findspots')
    .setDescription('Find chill spots near your college')
    .addStringOption(option =>
        option.setName('category')
            .setDescription('Filter by type of spot')
            .setRequired(false)
            .addChoices(
                { name: '☕ Café', value: 'cafe' },
                { name: '🍕 Restaurant', value: 'restaurant' },
                { name: '📚 Library', value: 'library' },
                { name: '🌳 Park', value: 'park' },
                { name: '🎮 Arcade/Gaming', value: 'arcade' },
                { name: '🛍️ Mall', value: 'mall' },
                { name: '📍 Other', value: 'other' }
            ))
    .addStringOption(option =>
        option.setName('vibe')
            .setDescription('Filter by vibe')
            .setRequired(false)
            .addChoices(
                { name: '🤫 Quiet - Good for studying', value: 'quiet' },
                { name: '🎉 Social - Good for hangouts', value: 'social' }
            ))
    .addStringOption(option =>
        option.setName('budget')
            .setDescription('Filter by budget')
            .setRequired(false)
            .addChoices(
                { name: '🆓 Free', value: 'free' },
                { name: '💵 Cheap', value: 'cheap' },
                { name: '💰 Moderate', value: 'moderate' },
                { name: '💎 Expensive', value: 'expensive' }
            ));

export async function execute(interaction) {
    // Check if user has set their college
    const user = await User.findOne({ discordId: interaction.user.id });
    
    if (!user?.college?.id) {
        return interaction.reply({
            embeds: [errorEmbed(
                'College Not Set',
                'Please set your college first using `/setcollege` to find nearby spots!'
            )],
            ephemeral: true
        });
    }
    
    await interaction.deferReply();
    
    // Build query
    const query = { college: user.college.id };
    
    const category = interaction.options.getString('category');
    const vibe = interaction.options.getString('vibe');
    const budget = interaction.options.getString('budget');
    
    if (category) query.category = category;
    if (vibe) query.vibe = { $in: [vibe, 'both'] };
    if (budget) query.budget = budget;
    
    // Find spots
    const spots = await Spot.find(query)
        .sort({ upvotes: -1, createdAt: -1 })
        .limit(10);
    
    if (spots.length === 0) {
        const noSpotsEmbed = warningEmbed(
            'No Spots Found',
            `No chill spots found near **${user.college.name}** with your filters.\n\nBe the first to add one with \`/addspot\`!`
        );
        return interaction.editReply({ embeds: [noSpotsEmbed] });
    }
    
    // Emoji maps
    const categoryEmoji = {
        cafe: '☕', restaurant: '🍕', library: '📚',
        park: '🌳', arcade: '🎮', mall: '🛍️', other: '📍'
    };
    
    const vibeEmoji = { quiet: '🤫', social: '🎉', both: '🔄' };
    const budgetEmoji = { free: '🆓', cheap: '💵', moderate: '💰', expensive: '💎' };
    
    // Build spot list
    const spotList = spots.map((spot, index) => {
        const score = spot.upvotes - spot.downvotes;
        const scoreText = score > 0 ? `+${score}` : score.toString();
        return `**${index + 1}. ${categoryEmoji[spot.category]} ${spot.name}**\n` +
               `   ${vibeEmoji[spot.vibe]} ${spot.vibe} • ${budgetEmoji[spot.budget]} ${spot.budget} • 📏 ${spot.distance}\n` +
               `   👍 ${scoreText} votes`;
    }).join('\n\n');
    
    // Build filter description
    const filters = [];
    if (category) filters.push(categoryEmoji[category] + ' ' + category);
    if (vibe) filters.push(vibeEmoji[vibe] + ' ' + vibe);
    if (budget) filters.push(budgetEmoji[budget] + ' ' + budget);
    const filterText = filters.length > 0 ? `\n**Filters:** ${filters.join(' • ')}` : '';
    
    const embed = createEmbed({
        title: `📍 Chill Spots near ${user.college.name}`,
        description: `Found **${spots.length}** spot${spots.length > 1 ? 's' : ''}!${filterText}\n\n${spotList}`,
        color: Colors.PRIMARY,
        footer: 'Use /addspot to add more spots • /spotinfo [name] for details'
    });
    
    await interaction.editReply({ embeds: [embed] });
}
