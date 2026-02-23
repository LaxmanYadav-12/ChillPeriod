import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors, errorEmbed, successEmbed } from '../utils/embed.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

export const data = new SlashCommandBuilder()
    .setName('tasks')
    .setDescription('View your active to-do list');

export async function execute(interaction) {
    await interaction.deferReply();
    const user = await User.findOne({ discordId: interaction.user.id });
    
    if (!user) {
        return interaction.editReply({ embeds: [errorEmbed('Not Found', 'Please connect your account on the web app first.')] });
    }

    const tasks = await Task.find({ userId: user._id, completed: false }).sort({ dueDate: 1, createdAt: -1 });

    if (tasks.length === 0) {
        return interaction.editReply({ embeds: [successEmbed('All caught up!', 'You have no pending tasks. Enjoy your chill period! 🎉')] });
    }

    const embed = createEmbed({
        title: '📋 Your Pending Tasks',
        color: Colors.PRIMARY,
        footer: `Use /addtask to add • /donetask to complete`
    });

    tasks.forEach((task, index) => {
        let titleStr = `**${index + 1}. ${task.title}**`;
        let details = '';
        
        if (task.priority === 'High') titleStr = '🔴 ' + titleStr;
        else if (task.priority === 'Medium') titleStr = '🟡 ' + titleStr;
        else titleStr = '🟢 ' + titleStr;

        if (task.dueDate) {
            const unixTime = Math.floor(task.dueDate.getTime() / 1000);
            details += `Due: <t:${unixTime}:R>\n`;
        }
        
        if (task.tags && task.tags.length > 0) {
            details += `Tags: ${task.tags.join(', ')}\n`;
        }

        embed.addFields({ name: titleStr, value: details || 'No details', inline: false });
    });

    await interaction.editReply({ embeds: [embed] });
}
