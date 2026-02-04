import { EmbedBuilder } from 'discord.js';

// ChillPeriod brand colors
export const Colors = {
    PRIMARY: 0x7C3AED,    // Purple
    SUCCESS: 0x10B981,    // Green
    WARNING: 0xF59E0B,    // Amber
    DANGER: 0xEF4444,     // Red
    INFO: 0x3B82F6,       // Blue
};

/**
 * Create a standard ChillPeriod embed
 * @param {Object} options - Embed options
 * @returns {EmbedBuilder}
 */
export function createEmbed({ 
    title, 
    description, 
    color = Colors.PRIMARY,
    fields = [],
    footer = null,
    thumbnail = null,
    image = null 
}) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTimestamp();
    
    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (fields.length > 0) embed.addFields(fields);
    if (footer) embed.setFooter({ text: footer });
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (image) embed.setImage(image);
    
    return embed;
}

/**
 * Create a success embed
 */
export function successEmbed(title, description) {
    return createEmbed({
        title: `✅ ${title}`,
        description,
        color: Colors.SUCCESS,
    });
}

/**
 * Create an error embed
 */
export function errorEmbed(title, description) {
    return createEmbed({
        title: `❌ ${title}`,
        description,
        color: Colors.DANGER,
    });
}

/**
 * Create a warning embed
 */
export function warningEmbed(title, description) {
    return createEmbed({
        title: `⚠️ ${title}`,
        description,
        color: Colors.WARNING,
    });
}

/**
 * Create an info embed
 */
export function infoEmbed(title, description) {
    return createEmbed({
        title: `ℹ️ ${title}`,
        description,
        color: Colors.INFO,
    });
}
