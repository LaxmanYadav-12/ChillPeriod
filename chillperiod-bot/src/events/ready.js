import { Events, ActivityType } from 'discord.js';

export const name = Events.ClientReady;
export const once = true;

export async function execute(client) {
    console.log('');
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║         🎉 ChillPeriod Bot Online!        ║');
    console.log('╠═══════════════════════════════════════════╣');
    console.log(`║  Logged in as: ${client.user.tag.padEnd(25)} ║`);
    console.log(`║  Servers: ${String(client.guilds.cache.size).padEnd(30)} ║`);
    console.log(`║  Commands: ${String(client.commands.size).padEnd(29)} ║`);
    console.log('╚═══════════════════════════════════════════╝');
    console.log('');
    
    // Set bot presence
    client.user.setPresence({
        activities: [{
            name: 'for chill spots 🎯',
            type: ActivityType.Watching,
        }],
        status: 'online',
    });
}
