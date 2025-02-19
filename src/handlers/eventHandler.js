const fs = require('fs');
const path = require('path');

const REQUIRED_ROLE_ID = process.env.REQUIRED_ROLE_ID;

function loadEvents(client) {
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }

    // Handle interactionCreate event for commands
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        try {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.log(`Command ${interaction.commandName} not found.`);
                return interaction.reply({ content: 'Command not found.', flags: ['Ephemeral'] });
            }

            if (REQUIRED_ROLE_ID && !interaction.member.roles.cache.has(REQUIRED_ROLE_ID)) {
                return interaction.reply({
                    content: 'You do not have the required role to use this command.',
                    flags: ['Ephemeral']
                });
            }

            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);
            const reply = {
                content: 'There was an error executing this command!',
                flags: ['Ephemeral']
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(reply);
            } else {
                await interaction.reply(reply);
            }
        }
    });
}

module.exports = { loadEvents };
