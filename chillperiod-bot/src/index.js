import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import { connectDatabase } from './utils/database.js';

// Load environment variables
config();

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Discord client with necessary intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

// Collection to store commands
client.commands = new Collection();

// Load commands dynamically
async function loadCommands() {
    const commandsPath = join(__dirname, 'commands');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = await import(`file://${filePath}`);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Loaded command: ${command.data.name}`);
        } else {
            console.log(`⚠️ Command at ${filePath} is missing required "data" or "execute" property`);
        }
    }
}

// Load events dynamically
async function loadEvents() {
    const eventsPath = join(__dirname, 'events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = join(eventsPath, file);
        const event = await import(`file://${filePath}`);
        
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`✅ Loaded event: ${event.name}`);
    }
}

// Initialize the bot
async function init() {
    try {
        // Try to connect to MongoDB (optional for basic functionality)
        try {
            await connectDatabase();
        } catch (dbError) {
            console.log('⚠️ MongoDB not available - running without database');
            console.log('   Some features will be limited until MongoDB is connected.');
        }
        
        // Load commands and events
        await loadCommands();
        await loadEvents();
        
        // Login to Discord
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('❌ Failed to initialize bot:', error);
        process.exit(1);
    }
}

// Start the bot
init();
