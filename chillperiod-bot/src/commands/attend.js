import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors, successEmbed, errorEmbed } from '../utils/embed.js';
import Attendance from '../models/Attendance.js';

export const data = new SlashCommandBuilder()
    .setName('attend')
    .setDescription('Mark a class as attended')
    .addStringOption(option =>
        option.setName('course')
            .setDescription('Which course? (leave empty if using quick mode)')
            .setRequired(false)
            .setMaxLength(50))
    .addIntegerOption(option =>
        option.setName('count')
            .setDescription('How many classes attended? (default: 1)')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(10));

export async function execute(interaction) {
    const courseName = interaction.options.getString('course');
    const count = interaction.options.getInteger('count') || 1;
    
    let attendance = await Attendance.findOne({ discordId: interaction.user.id });
    
    if (!attendance) {
        return interaction.reply({
            embeds: [errorEmbed(
                'No Attendance Data',
                'Set up your attendance first with `/setattendance`!'
            )],
            ephemeral: true
        });
    }
    
    const beforePercentage = attendance.percentage;
    
    // Update attendance
    if (courseName && attendance.courses.length > 1) {
        // Find specific course
        const course = attendance.courses.find(c => 
            c.name.toLowerCase().includes(courseName.toLowerCase())
        );
        
        if (!course) {
            return interaction.reply({
                embeds: [errorEmbed(
                    'Course Not Found',
                    `Couldn't find course matching "${courseName}".\n\nYour courses: ${attendance.courses.map(c => c.name).join(', ')}`
                )],
                ephemeral: true
            });
        }
        
        course.totalClasses += count;
        course.attendedClasses += count;
        attendance.recalculateTotals();
    } else {
        // Quick mode - update first/only course
        if (attendance.courses.length > 0) {
            attendance.courses[0].totalClasses += count;
            attendance.courses[0].attendedClasses += count;
        }
        attendance.totalClasses += count;
        attendance.attendedClasses += count;
    }
    
    await attendance.save();
    
    // Get new status
    const afterStatus = attendance.getStatus();
    const afterPercentage = attendance.percentage;
    
    const embed = createEmbed({
        title: `✅ Attended ${count} Class${count > 1 ? 'es' : ''}!`,
        description: `${beforePercentage}% → **${afterPercentage}%**\n\n${afterStatus.emoji} ${afterStatus.message}`,
        color: afterStatus.color,
        footer: 'Use /attendance to see full stats'
    });
    
    await interaction.reply({ embeds: [embed] });
}
