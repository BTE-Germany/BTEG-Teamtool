const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const emotes = require("../../emotes.json");

module.exports = async function (interaction) {
  const channel = interaction.options.channel || interaction.channel;
  interaction.reply({ content: "Generating a new embed...", ephemeral: true });
  channel
    .send({
      content: "** **",
      components: [
        {
          type: 1,
          components: [
            {
              style: 2,
              emoji: {
                id: emotes["online"].split(":")[2].replace(">", ""),
                name: emotes["online"].split(":")[1],
                animated: false,
              },
              custom_id: `AbsenceSetAvailable`,
              disabled: false,
              type: 2,
            },
            {
              style: 2,
              emoji: {
                id: emotes["idle"].split(":")[2].replace(">", ""),
                name: emotes["idle"].split(":")[1],
                animated: false,
              },
              custom_id: `AbsenceSetIdle`,
              disabled: false,
              type: 2,
            },
            {
              style: 2,
              emoji: {
                id: emotes["dnd"].split(":")[2].replace(">", ""),
                name: emotes["dnd"].split(":")[1],
                animated: false,
              },
              custom_id: `AbsenceSetDND`,
              disabled: false,
              type: 2,
            },
            {
              style: 2,
              emoji: {
                id: emotes["offline"].split(":")[2].replace(">", ""),
                name: `offline`,
                animated: false,
              },
              custom_id: `AbsenceSetOffline`,
              disabled: false,
              type: 2,
            },
          ],
        },
      ],
      embeds: [
        {
          type: "rich",
          title: `💤 | Refreshing this embed`,
          description: `Please allow up to 30 seconds for this process to finish`,
          color: 0x00ffff,
          footer: {
            text: `BTE Teamtool`,
            icon_url: `https://bte-germany.de/logo.gif`,
          },
        },
      ],
    })
    .then(async (r) => {
      prisma.absencePanel
        .create({
          data: {
            id: r.id,
            channel: r.channel.id,
          },
        })
        .then(() => {
          interaction.editReply({ content: "Done!", ephemeral: true });
        });
    });
};
