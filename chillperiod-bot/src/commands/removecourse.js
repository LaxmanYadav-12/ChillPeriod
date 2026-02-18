import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, Colors, successEmbed, errorEmbed } from '../utils/embed.js';
import User from '../models/User.js';

export const data = new SlashCommandBuilder()
    .setName('removecourse')
    .setDescription('Remove a course from your attendance tracking')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Course name to remove (partial match works)')
            .setRequired(true)
            .setMaxLength(50));

export async function execute(interaction) {
    const courseName = interaction.options.getString('name');

    const user = await User.findOne({ discordId: interaction.user.id });

    if (!user || !user.courses || user.courses.length === 0) {
        return interaction.reply({
            embeds: [errorEmbed(
                'No Courses',
                'You don\'t have any courses to remove!\n\nUse `/addcourse` to add courses first.'
            )],
            ephemeral: true
        });
    }

    // Find matching course (fuzzy)
    const courseIndex = user.courses.findIndex(c =>
        c.name.toLowerCase().includes(courseName.toLowerCase())
    );

    if (courseIndex === -1) {
        const courseList = user.courses.map(c => `• ${c.name}`).join('\n');
        return interaction.reply({
            embeds: [errorEmbed(
                'Course Not Found',
                `Couldn't find a course matching **"${courseName}"**.\n\nYour courses:\n${courseList}`
            )],
            ephemeral: true
        });
    }

    const removedCourse = user.courses[courseIndex];
    const coursePct = removedCourse.totalClasses > 0
        ? Math.round((removedCourse.attendedClasses / removedCourse.totalClasses) * 100)
        : 100;

    // Remove the course
    user.courses.splice(courseIndex, 1);

    // Recalculate global stats
    user.totalClasses = user.courses.reduce((sum, c) => sum + c.totalClasses, 0);
    user.attendedClasses = user.courses.reduce((sum, c) => sum + c.attendedClasses, 0);

    await user.save();

    const embed = createEmbed({
        title: '🗑️ Course Removed',
        description:
            `Removed **${removedCourse.name}**${removedCourse.code ? ` (${removedCourse.code})` : ''}\n\n` +
            `It had **${removedCourse.attendedClasses}/${removedCourse.totalClasses}** classes (${coursePct}%)\n\n` +
            `You now have **${user.courses.length}** course${user.courses.length !== 1 ? 's' : ''} remaining.`,
        color: Colors.WARNING,
        footer: 'Use /addcourse to add a new course • /attendance to view stats'
    });

    await interaction.reply({ embeds: [embed] });
}
