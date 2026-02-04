import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { createEmbed, Colors, successEmbed, errorEmbed } from '../utils/embed.js';
import Spot from '../models/Spot.js';
import User from '../models/User.js';

export const data = new SlashCommandBuilder()
    .setName('addspot')
    .setDescription('Add a new chill spot for students')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Name of the spot (e.g., "Blue Tokai Coffee")')
            .setRequired(true)
            .setMaxLength(100))
    .addStringOption(option =>
        option.setName('category')
            .setDescription('Type of spot')
            .setRequired(true)
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
            .setDescription('What\'s the vibe like?')
            .setRequired(true)
            .addChoices(
                { name: '🤫 Quiet - Good for studying', value: 'quiet' },
                { name: '🎉 Social - Good for hangouts', value: 'social' },
                { name: '🔄 Both - Flexible', value: 'both' }
            ))
    .addStringOption(option =>
        option.setName('budget')
            .setDescription('How expensive is it?')
            .setRequired(true)
            .addChoices(
                { name: '🆓 Free', value: 'free' },
                { name: '💵 Cheap (< ₹100)', value: 'cheap' },
                { name: '💰 Moderate (₹100-300)', value: 'moderate' },
                { name: '💎 Expensive (₹300+)', value: 'expensive' }
            ))
    .addStringOption(option =>
        option.setName('distance')
            .setDescription('How far from campus? (e.g., "5 min walk", "2km")')
            .setRequired(false)
            .setMaxLength(50))
    .addStringOption(option =>
        option.setName('description')
            .setDescription('Brief description or tips')
            .setRequired(false)
            .setMaxLength(500));

export async function execute(interaction) {
    // Check if user has set their college
    const user = await User.findOne({ discordId: interaction.user.id });
    
    if (!user?.college?.id) {
        return interaction.reply({
            embeds: [errorEmbed(
                'College Not Set',
                'Please set your college first using `/setcollege` before adding spots!'
            )],
            ephemeral: true
        });
    }
    
    // Get options
    const name = interaction.options.getString('name');
    const category = interaction.options.getString('category');
    const vibe = interaction.options.getString('vibe');
    const budget = interaction.options.getString('budget');
    const distance = interaction.options.getString('distance') || 'Not specified';
    const description = interaction.options.getString('description') || '';
    
    // Create spot
    const spot = new Spot({
        name,
        description,
        college: user.college.id,
        category,
        vibe,
        budget,
        distance,
        addedBy: {
            discordId: interaction.user.id,
            username: interaction.user.username
        }
    });
    
    await spot.save();
    
    // Update user stats
    await User.updateOne(
        { discordId: interaction.user.id },
        { $inc: { 'stats.spotsAdded': 1 } }
    );
    
    // Category emoji map
    const categoryEmoji = {
        cafe: '☕',
        restaurant: '🍕',
        library: '📚',
        park: '🌳',
        arcade: '🎮',
        mall: '🛍️',
        other: '📍'
    };
    
    const vibeEmoji = {
        quiet: '🤫',
        social: '🎉',
        both: '🔄'
    };
    
    const budgetEmoji = {
        free: '🆓',
        cheap: '💵',
        moderate: '💰',
        expensive: '💎'
    };
    
    const embed = successEmbed(
        'Spot Added!',
        `**${name}** has been added to ${user.college.name}!`
    );
    
    embed.addFields(
        { name: 'Category', value: `${categoryEmoji[category]} ${category}`, inline: true },
        { name: 'Vibe', value: `${vibeEmoji[vibe]} ${vibe}`, inline: true },
        { name: 'Budget', value: `${budgetEmoji[budget]} ${budget}`, inline: true },
        { name: 'Distance', value: distance, inline: true }
    );
    
    if (description) {
        embed.addFields({ name: 'Description', value: description, inline: false });
    }
    
    embed.setFooter({ text: `Added by ${interaction.user.username} • ID: ${spot._id}` });
    
    await interaction.reply({ embeds: [embed] });
}
