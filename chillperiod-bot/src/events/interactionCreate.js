import { Events } from 'discord.js';
import { errorEmbed } from '../utils/embed.js';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction) {
    // Only handle slash commands
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
    
    if (!command) {
        console.error(`❌ No command matching ${interaction.commandName} was found.`);
        return;
    }
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Error executing ${interaction.commandName}:`, error);
        
        const errorResponse = {
            embeds: [errorEmbed('Command Error', 'There was an error executing this command!')],
            ephemeral: true,
        };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorResponse);
        } else {
            await interaction.reply(errorResponse);
        }
    }
}
