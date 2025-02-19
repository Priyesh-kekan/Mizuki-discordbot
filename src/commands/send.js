const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Sends a message to a specific channel')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to send the message to')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');

        if (!channel.isTextBased()) {
            return interaction.reply({ content: 'Please select a text channel.', flags: ['Ephemeral'] });
        }

        try {
            await channel.send(message);
            await interaction.reply({ content: 'Message sent successfully!', flags: ['Ephemeral'] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error sending the message.', flags: ['Ephemeral'] });
        }
    },
};
