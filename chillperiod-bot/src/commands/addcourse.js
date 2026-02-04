import { SlashCommandBuilder } from 'discord.js';
import { successEmbed, errorEmbed } from '../utils/embed.js';
import Attendance from '../models/Attendance.js';

export const data = new SlashCommandBuilder()
    .setName('addcourse')
    .setDescription('Add a course to track separately')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Course name (e.g., "Data Structures")')
            .setRequired(true)
            .setMaxLength(50))
    .addStringOption(option =>
        option.setName('code')
            .setDescription('Course code (e.g., "CS201")')
            .setRequired(false)
            .setMaxLength(20))
    .addIntegerOption(option =>
        option.setName('total')
            .setDescription('Total classes held so far (default: 0)')
            .setRequired(false)
            .setMinValue(0))
    .addIntegerOption(option =>
        option.setName('attended')
            .setDescription('Classes attended so far (default: 0)')
            .setRequired(false)
            .setMinValue(0));

export async function execute(interaction) {
    const name = interaction.options.getString('name');
    const code = interaction.options.getString('code') || '';
    const total = interaction.options.getInteger('total') || 0;
    const attended = interaction.options.getInteger('attended') || 0;
    
    if (attended > total) {
        return interaction.reply({
            embeds: [errorEmbed(
                'Invalid Input',
                'Attended classes cannot be more than total classes!'
            )],
            ephemeral: true
        });
    }
    
    // Get or create attendance record
    let attendance = await Attendance.findOne({ discordId: interaction.user.id });
    
    if (!attendance) {
        attendance = new Attendance({
            discordId: interaction.user.id,
            username: interaction.user.username,
            courses: []
        });
    }
    
    // Check if course already exists
    const existingCourse = attendance.courses.find(c => 
        c.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingCourse) {
        return interaction.reply({
            embeds: [errorEmbed(
                'Course Already Exists',
                `You already have a course named "${name}". Use \`/editcourse\` to modify it.`
            )],
            ephemeral: true
        });
    }
    
    // Remove "All Classes" placeholder if it exists and adding first real course
    if (attendance.courses.length === 1 && attendance.courses[0].name === 'All Classes') {
        attendance.courses = [];
    }
    
    // Add new course
    attendance.courses.push({
        name,
        code,
        totalClasses: total,
        attendedClasses: attended
    });
    
    // Recalculate totals
    attendance.recalculateTotals();
    
    await attendance.save();
    
    const courseCount = attendance.courses.length;
    const percentage = total > 0 ? Math.round((attended / total) * 100) : 100;
    
    await interaction.reply({
        embeds: [successEmbed(
            'Course Added!',
            `**${name}**${code ? ` (${code})` : ''}\n` +
            `Attendance: ${attended}/${total} (${percentage}%)\n\n` +
            `You now have **${courseCount}** course${courseCount > 1 ? 's' : ''} being tracked.\n` +
            `Use \`/attendance\` to view your dashboard!`
        )]
    });
}
