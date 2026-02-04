import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { createEmbed, Colors, successEmbed } from '../utils/embed.js';
import User from '../models/User.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const colleges = JSON.parse(readFileSync(join(__dirname, '../../config/colleges.json'), 'utf-8'));

export const data = new SlashCommandBuilder()
    .setName('setcollege')
    .setDescription('Set your college for location-based chill spot search');

export async function execute(interaction) {
    // Create dropdown menu with colleges
    const collegeOptions = colleges.colleges.slice(0, 25).map(college => ({
        label: college.name,
        description: `${college.city}, ${college.state}`,
        value: college.id
    }));
    
    const select = new StringSelectMenuBuilder()
        .setCustomId('college_select')
        .setPlaceholder('Select your college...')
        .addOptions(collegeOptions);
    
    const row = new ActionRowBuilder().addComponents(select);
    
    const embed = createEmbed({
        title: '🎓 Set Your College',
        description: 'Select your college from the dropdown below. This helps us find chill spots near you!',
        color: Colors.PRIMARY,
        footer: 'Don\'t see your college? More coming soon!'
    });
    
    const response = await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
    });
    
    // Wait for selection
    try {
        const confirmation = await response.awaitMessageComponent({
            filter: i => i.user.id === interaction.user.id,
            time: 60_000
        });
        
        const selectedCollegeId = confirmation.values[0];
        const selectedCollege = colleges.colleges.find(c => c.id === selectedCollegeId);
        
        // Save to database
        await User.findOneAndUpdate(
            { discordId: interaction.user.id },
            {
                discordId: interaction.user.id,
                username: interaction.user.username,
                college: {
                    id: selectedCollege.id,
                    name: selectedCollege.name,
                    city: selectedCollege.city
                }
            },
            { upsert: true, new: true }
        );
        
        await confirmation.update({
            embeds: [successEmbed(
                'College Set!',
                `You're now registered at **${selectedCollege.name}**, ${selectedCollege.city}!\n\nUse \`/findspots\` to discover chill spots nearby.`
            )],
            components: []
        });
        
    } catch (e) {
        await interaction.editReply({
            embeds: [createEmbed({
                title: '⏰ Timed Out',
                description: 'You didn\'t select a college in time. Run `/setcollege` again.',
                color: Colors.WARNING
            })],
            components: []
        });
    }
}
