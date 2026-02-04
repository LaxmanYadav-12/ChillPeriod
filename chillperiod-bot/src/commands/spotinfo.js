import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createEmbed, Colors, errorEmbed, successEmbed } from '../utils/embed.js';
import Spot from '../models/Spot.js';
import User from '../models/User.js';

export const data = new SlashCommandBuilder()
    .setName('spotinfo')
    .setDescription('Get detailed info about a chill spot')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Name of the spot to look up')
            .setRequired(true)
            .setAutocomplete(true));

export async function execute(interaction) {
    const searchName = interaction.options.getString('name');
    
    // Get user's college
    const user = await User.findOne({ discordId: interaction.user.id });
    
    // Build query - search in user's college first, then globally
    let spot = null;
    
    if (user?.college?.id) {
        spot = await Spot.findOne({
            college: user.college.id,
            name: { $regex: searchName, $options: 'i' }
        });
    }
    
    // If not found in user's college, search globally
    if (!spot) {
        spot = await Spot.findOne({
            name: { $regex: searchName, $options: 'i' }
        });
    }
    
    if (!spot) {
        return interaction.reply({
            embeds: [errorEmbed(
                'Spot Not Found',
                `Couldn't find a spot matching "**${searchName}**".\n\nTry \`/findspots\` to see available spots.`
            )],
            ephemeral: true
        });
    }
    
    // Emoji maps
    const categoryEmoji = {
        cafe: '☕', restaurant: '🍕', library: '📚',
        park: '🌳', arcade: '🎮', mall: '🛍️', other: '📍'
    };
    const vibeEmoji = { quiet: '🤫', social: '🎉', both: '🔄' };
    const budgetEmoji = { free: '🆓', cheap: '💵', moderate: '💰', expensive: '💎' };
    
    const score = spot.upvotes - spot.downvotes;
    const scoreColor = score > 0 ? Colors.SUCCESS : score < 0 ? Colors.DANGER : Colors.INFO;
    
    const embed = createEmbed({
        title: `${categoryEmoji[spot.category]} ${spot.name}`,
        description: spot.description || '_No description provided_',
        color: scoreColor,
        fields: [
            { name: 'Category', value: `${categoryEmoji[spot.category]} ${spot.category}`, inline: true },
            { name: 'Vibe', value: `${vibeEmoji[spot.vibe]} ${spot.vibe}`, inline: true },
            { name: 'Budget', value: `${budgetEmoji[spot.budget]} ${spot.budget}`, inline: true },
            { name: 'Distance', value: `📏 ${spot.distance || 'Not specified'}`, inline: true },
            { name: 'Score', value: `${score > 0 ? '👍' : score < 0 ? '👎' : '➖'} ${score} (${spot.upvotes}↑ ${spot.downvotes}↓)`, inline: true },
            { name: 'Added By', value: `@${spot.addedBy?.username || 'Unknown'}`, inline: true }
        ],
        footer: `ID: ${spot._id} • Added ${spot.createdAt.toLocaleDateString()}`
    });
    
    // Create vote buttons
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`upvote_${spot._id}`)
                .setLabel(`👍 ${spot.upvotes}`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`downvote_${spot._id}`)
                .setLabel(`👎 ${spot.downvotes}`)
                .setStyle(ButtonStyle.Danger)
        );
    
    const response = await interaction.reply({
        embeds: [embed],
        components: [row],
        fetchReply: true
    });
    
    // Handle button interactions
    const collector = response.createMessageComponentCollector({
        time: 300_000 // 5 minutes
    });
    
    collector.on('collect', async (buttonInteraction) => {
        const [action, spotId] = buttonInteraction.customId.split('_');
        
        // Check if user already voted
        const voter = spot.voters.find(v => v.odId === buttonInteraction.user.id);
        const voteValue = action === 'upvote' ? 1 : -1;
        
        if (voter) {
            if (voter.vote === voteValue) {
                // Remove vote
                spot.voters = spot.voters.filter(v => v.odId !== buttonInteraction.user.id);
                if (action === 'upvote') spot.upvotes--;
                else spot.downvotes--;
            } else {
                // Change vote
                voter.vote = voteValue;
                if (action === 'upvote') {
                    spot.upvotes++;
                    spot.downvotes--;
                } else {
                    spot.downvotes++;
                    spot.upvotes--;
                }
            }
        } else {
            // New vote
            spot.voters.push({ odId: buttonInteraction.user.id, vote: voteValue });
            if (action === 'upvote') spot.upvotes++;
            else spot.downvotes++;
        }
        
        await spot.save();
        
        // Update buttons
        const updatedRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`upvote_${spot._id}`)
                    .setLabel(`👍 ${spot.upvotes}`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`downvote_${spot._id}`)
                    .setLabel(`👎 ${spot.downvotes}`)
                    .setStyle(ButtonStyle.Danger)
            );
        
        await buttonInteraction.update({ components: [updatedRow] });
    });
}
