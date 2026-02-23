import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } from 'discord.js';
import { errorEmbed } from '../utils/embed.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

export const data = new SlashCommandBuilder()
    .setName('donetask')
    .setDescription('Mark a task as completed from your to-do list');

export async function execute(interaction) {
     await interaction.deferReply({ ephemeral: true });
     const user = await User.findOne({ discordId: interaction.user.id });
    
     if (!user) {
         return interaction.editReply({ embeds: [errorEmbed('Not Found', 'Please connect your account on the web app first.')] });
     }

     const tasks = await Task.find({ userId: user._id, completed: false }).sort({ createdAt: -1 }).limit(25);

     if (tasks.length === 0) {
         return interaction.editReply({ content: '🎉 You have no pending tasks to complete. All caught up!' });
     }

     const selectMenu = new StringSelectMenuBuilder()
         .setCustomId('select_task_done')
         .setPlaceholder('Select a task to complete...')
         .addOptions(
             tasks.map((task, index) => ({
                 label: `${index + 1}. ${task.title.substring(0, 90)}`,
                 description: task.priority ? `Priority: ${task.priority}` : '',
                 value: task._id.toString()
             }))
         );

     const row = new ActionRowBuilder().addComponents(selectMenu);

     const response = await interaction.editReply({
         content: 'Which task did you finish?',
         components: [row]
     });

     try {
         const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60000 });

         collector.on('collect', async i => {
             if (i.user.id === interaction.user.id) {
                 const taskId = i.values[0];
                 await Task.findByIdAndUpdate(taskId, { completed: true });
                 
                 await i.update({ 
                     content: `✅ Task marked as completed! Great job.`, 
                     components: [], 
                     embeds: [] 
                 });
                 collector.stop();
             }
         });

         collector.on('end', collected => {
             if (collected.size === 0) {
                 interaction.editReply({ content: '❌ Task selection timed out.', components: [] }).catch(() => {});
             }
         });

     } catch (e) {
         console.error('Collector setup error', e);
         interaction.editReply({ content: '❌ An error occurred.', components: [] }).catch(() => {});
     }
}
