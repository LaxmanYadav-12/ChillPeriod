import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors } from '../utils/embed.js';
import { excusesData } from '../data/excuses.js';

const toneChoices = [
    { name: '😂 Funny', value: 'funny' },
    { name: '😐 Serious', value: 'serious' },
    { name: '🏥 Medical', value: 'medical' },
    { name: '💼 Professional', value: 'professional' },
    { name: '🎭 Dramatic', value: 'dramatic' },
];

const toneEmojis = {
    funny: '😂',
    serious: '😐',
    medical: '🏥',
    professional: '💼',
    dramatic: '🎭',
};

export const data = new SlashCommandBuilder()
    .setName('excuse')
    .setDescription('Generate a random excuse for bunking class')
    .addStringOption(option =>
        option.setName('tone')
            .setDescription('What tone should the excuse be?')
            .setRequired(false)
            .addChoices(...toneChoices));

export async function execute(interaction) {
    const tone = interaction.options.getString('tone') || 
        Object.keys(excusesData.tones)[Math.floor(Math.random() * Object.keys(excusesData.tones).length)];
    
    const excuses = excusesData.tones[tone];
    if (!excuses || excuses.length === 0) {
        return interaction.reply({ content: 'No excuses found for that tone!', ephemeral: true });
    }

    const excuse = excuses[Math.floor(Math.random() * excuses.length)];
    const emoji = toneEmojis[tone] || '🎲';

    const embed = createEmbed({
        title: `${emoji} Excuse Generator`,
        description: `> *"${excuse}"*`,
        color: Colors.PRIMARY,
        fields: [
            {
                name: '🎭 Tone',
                value: tone.charAt(0).toUpperCase() + tone.slice(1),
                inline: true
            },
            {
                name: '📋 Copy-Paste Ready',
                value: excuse,
                inline: false
            }
        ],
        footer: 'Use /excuse [tone] to get a specific tone • ChillPeriod'
    });

    await interaction.reply({ embeds: [embed] });
}
