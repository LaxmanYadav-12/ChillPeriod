import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];

// Load all commands
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

async function loadCommands() {
    for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = await import(`file://${filePath}`);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        }
    }
}

async function deployCommands() {
    await loadCommands();
    
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    
    try {
        console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);
        
        // Deploy to specific guild (faster for development)
        if (process.env.GUILD_ID) {
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands },
            );
            console.log(`✅ Successfully reloaded ${data.length} guild commands.`);
        } else {
            // Deploy globally (takes up to 1 hour to propagate)
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );
            console.log(`✅ Successfully reloaded ${data.length} global commands.`);
        }
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
}

deployCommands();
