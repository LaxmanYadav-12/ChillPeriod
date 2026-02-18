import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createEmbed, Colors, errorEmbed } from '../utils/embed.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const data = new SlashCommandBuilder()
    .setName('massbunk')
    .setDescription('Announce a mass bunk and notify your followers!')
    .addStringOption(option =>
        option.setName('course')
            .setDescription('Which course to mass bunk?')
            .setRequired(true)
            .setMaxLength(50))
    .addStringOption(option =>
        option.setName('reason')
            .setDescription('Why are you bunking? (optional)')
            .setRequired(false)
            .setMaxLength(200));

export async function execute(interaction) {
    const courseName = interaction.options.getString('course');
    const reason = interaction.options.getString('reason') || 'No reason given (true rebel energy 😎)';

    const user = await User.findOne({ discordId: interaction.user.id });
    
    if (!user) {
        return interaction.reply({
            embeds: [errorEmbed(
                'Not Registered',
                'Set up your profile first with `/addcourse`!'
            )],
            ephemeral: true
        });
    }

    // Create the mass bunk announcement embed
    const bunkTitle = user.getBunkTitle();
    
    const embed = createEmbed({
        title: '🚨 MASS BUNK ALERT! 🚨',
        description: 
            `**${user.name || user.username}** is bunking **${courseName}**!\n\n` +
            `> 💬 *"${reason}"*\n\n` +
            `${bunkTitle.emoji} **${bunkTitle.title}** with ${user.totalBunks} bunks\n\n` +
            `Who's joining? React below! 👇`,
        color: 0xFF6B6B,
        fields: [
            {
                name: '📚 Course',
                value: courseName,
                inline: true
            },
            {
                name: '📊 Their Attendance',
                value: `${user.attendancePercentage}%`,
                inline: true
            }
        ],
        footer: 'ChillPeriod Mass Bunk • Use responsibly!'
    });

    // Create join button
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`massbunk_join_${interaction.user.id}`)
                .setLabel('🙋 I\'m In!')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`massbunk_nah_${interaction.user.id}`)
                .setLabel('😇 Nah, I\'m Good')
                .setStyle(ButtonStyle.Secondary)
        );

    const reply = await interaction.reply({ 
        embeds: [embed], 
        components: [row],
        fetchReply: true 
    });

    // Also create web notifications for followers
    const followerIds = user.followers || [];
    if (followerIds.length > 0) {
        const notifications = followerIds.map(followerId => ({
            userId: followerId,
            type: 'mass_bunk',
            title: '🚨 Mass Bunk Alert!',
            message: `${user.name || user.username} is bunking ${courseName}!`,
            fromUserId: user._id,
            metadata: { subject: courseName, reason }
        }));
        
        try {
            await Notification.insertMany(notifications);
        } catch (err) {
            console.error('Failed to create web notifications:', err);
        }
    }

    // Set up button collector (expires after 30 minutes)
    const collector = reply.createMessageComponentCollector({ time: 30 * 60 * 1000 });
    const joiners = new Set();

    collector.on('collect', async (btnInteraction) => {
        if (btnInteraction.customId.startsWith('massbunk_join_')) {
            if (joiners.has(btnInteraction.user.id)) {
                return btnInteraction.reply({ content: 'You already joined! 🎉', ephemeral: true });
            }
            joiners.add(btnInteraction.user.id);
            await btnInteraction.reply({ 
                content: `**${btnInteraction.user.username}** is joining the bunk! 🎉 (${joiners.size} total)`, 
            });
        } else if (btnInteraction.customId.startsWith('massbunk_nah_')) {
            await btnInteraction.reply({ 
                content: `${btnInteraction.user.username} is being responsible today 📚`, 
                ephemeral: true 
            });
        }
    });

    collector.on('end', async () => {
        const disabledRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('massbunk_expired_join')
                    .setLabel(`${joiners.size} Joined`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('massbunk_expired_nah')
                    .setLabel('Expired')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );
        
        try {
            await reply.edit({ components: [disabledRow] });
        } catch (err) {
            // Message may have been deleted
        }
    });
}
