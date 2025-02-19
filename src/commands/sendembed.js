const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendembed')
        .setDescription('Sends an embed message to a specific channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the embed to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send before the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('The footer of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('The image URL for the embed')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('useavatar')
                .setDescription('Whether to use the user\'s avatar as the embed thumbnail')
                .setRequired(false)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const footer = interaction.options.getString('footer');
        const image = interaction.options.getString('image');
        const useAvatar = interaction.options.getBoolean('useavatar');

        if (!channel.isTextBased()) {
            return interaction.reply({ content: 'Please select a text channel.', flags: ['Ephemeral'] });
        }

        const embed = new EmbedBuilder();

        if (title) embed.setTitle(title);
        if (description) embed.setDescription(description);
        if (footer) embed.setFooter({ text: footer });
        if (image) embed.setImage(image);
        if (useAvatar) embed.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));

        try {
            if (message) {
                await channel.send(message);
            }
            await channel.send({ embeds: [embed] });
            await interaction.reply({ content: 'Embed message sent successfully!', flags: ['Ephemeral'] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error sending the embed message.', flags: ['Ephemeral'] });
        }
    },
};
