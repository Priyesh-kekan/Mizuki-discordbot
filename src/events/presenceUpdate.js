const { EmbedBuilder } = require('discord.js');
const TARGET_STATUS = process.env.TARGET_STATUS;
const ROLE_ID = process.env.ROLE_ID;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;

module.exports = {
    name: 'presenceUpdate',
    async execute(oldPresence, newPresence, client) {
        if (!newPresence?.member) return;

        const guild = newPresence.guild;
        if (!guild) return;

        const role = guild.roles.cache.get(ROLE_ID);
        if (!role) {
            console.log(`Role with ID ${ROLE_ID} not found.`);
            return;
        }

        const logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);
        if (!logChannel) {
            console.log(`Log channel with ID ${LOG_CHANNEL_ID} not found.`);
            return;
        }

        const activities = newPresence.activities || [];
        let customStatus = null;
        for (const activity of activities) {
            if (activity.type === 4 && activity.state) {
                customStatus = activity.state;
                break;
            }
        }

        let embed;
        if (customStatus === TARGET_STATUS) {
            if (!newPresence.member.roles.cache.has(role.id)) {
                await newPresence.member.roles.add(role);
                embed = new EmbedBuilder()
                    .setTitle("Role Added")
                    .setDescription(`Added **${role.name}** to **${newPresence.member.displayName}** because their custom status matches \`${TARGET_STATUS}\`.`)
                    .setColor("Green")
                    .setTimestamp();
            } else {
                return;
            }
        } else {
            if (newPresence.member.roles.cache.has(role.id)) {
                await newPresence.member.roles.remove(role);
                embed = new EmbedBuilder()
                    .setTitle("Role Removed")
                    .setDescription(`Removed **${role.name}** from **${newPresence.member.displayName}** because their custom status no longer matches \`${TARGET_STATUS}\`.`)
                    .setColor("Red")
                    .setTimestamp();
            } else {
                return;
            }
        }

        logChannel.send({ embeds: [embed] });
    },
};
