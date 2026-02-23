import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors, errorEmbed, successEmbed } from '../utils/embed.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

export const data = new SlashCommandBuilder()
    .setName('addtask')
    .setDescription('Add a new task to your to-do list')
    .addStringOption(option => 
        option.setName('title')
            .setDescription('What do you need to do?')
            .setRequired(true)
            .setMaxLength(200)
    )
    .addStringOption(option =>
        option.setName('priority')
            .setDescription('Task priority')
            .addChoices(
                { name: 'High', value: 'High' },
                { name: 'Medium', value: 'Medium' },
                { name: 'Low', value: 'Low' }
            )
    )
    .addStringOption(option =>
        option.setName('due')
            .setDescription('Due date (YYYY-MM-DD or HH:MM). Example: 2026-12-31')
    )
    .addStringOption(option =>
        option.setName('tags')
            .setDescription('Comma-separated tags (e.g. Exam, Assignment)')
    );

export async function execute(interaction) {
    await interaction.deferReply();
    const user = await User.findOne({ discordId: interaction.user.id });
    
    if (!user) {
        return interaction.editReply({ embeds: [errorEmbed('Not Found', 'Please connect your account on the web app first.')] });
    }

    const title = interaction.options.getString('title');
    const priority = interaction.options.getString('priority') || 'Medium';
    const dueString = interaction.options.getString('due');
    const tagsString = interaction.options.getString('tags');
    
    let tags = [];
    if (tagsString) {
        tags = tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }

    let dueDate = null;
    if (dueString) {
        // Simple parsing attempt
        const parsed = new Date(dueString);
        if (!isNaN(parsed.getTime())) {
            dueDate = parsed;
        } else {
             // Let user know the date wasn't parsed correctly but add it anyway
             return interaction.editReply({ embeds: [errorEmbed('Invalid Date', 'Could not parse that due date. Please use YYYY-MM-DD format.')] });
        }
    }

    const newTask = new Task({
        userId: user._id,
        title,
        priority,
        tags,
        dueDate
    });

    await newTask.save();

    await interaction.editReply({ 
        embeds: [successEmbed('Task Added', `Successfully added **${title}** to your to-do list!`)] 
    });
}
