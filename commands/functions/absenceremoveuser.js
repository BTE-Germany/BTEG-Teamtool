const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async function (interaction) {
  let test = await prisma.absenceUser.findFirst({
    where: {
      id: interaction.options.get("user").user.id,
    },
  });
  if (test !== null) {
    prisma.absenceUser
      .delete({
        where: {
          id: interaction.options.get("user").user.id,
        }
      })
      .then(async () => {
        await interaction.reply({
          content: null,
          embeds: [
            {
              title: "✅ | Successfully removed this user!",
              color: 3553599,
              footer: {
                text: "BTE Teamtool",
                icon_url: "https://bte-germany.de/logo.gif",
              },
            },
          ],
          attachments: [],
          ephemeral: true,
        });
      })
      .catch(async (e) => {
        await interaction.reply({
          content: null,
          embeds: [
            {
              title:
                "❌ | Could not remove this user. Please try again later!",
              color: 3553599,
              footer: {
                text: "BTE Teamtool",
                icon_url: "https://bte-germany.de/logo.gif",
              },
            },
            {
              title: "❌ | Please provide this error",
              description: e.toString(),
              color: null,
              footer: {
                text: "BTE Teamtool",
                icon_url: "https://bte-germany.de/logo.gif",
              },
            },
          ],
          attachments: [],
          ephemeral: true,
        });
      });
  } else {
    prisma.absenceUser
      .delete({
        where: {
          id: interaction.options.get("user").user.id
        },
      })
      .then(async () => {
        await interaction.reply({
          content: null,
          embeds: [
            {
              title: "✅ | Successfully removed this user from the database!",
              color: 3553599,
              footer: {
                text: "BTE Teamtool",
                icon_url: "https://bte-germany.de/logo.gif",
              },
            },
          ],
          attachments: [],
          ephemeral: true,
        });
      })
      .catch(async (e) => {
        await interaction.reply({
          content: null,
          embeds: [
            {
              title:
                "❌ | Could not remover this user from the database. Please try again later!",
              color: 3553599,
              footer: {
                text: "BTE Teamtool",
                icon_url: "https://bte-germany.de/logo.gif",
              },
            },
            {
              title: "❌ | Please provide this error",
              description: e.toString(),
              color: null,
              footer: {
                text: "BTE Teamtool",
                icon_url: "https://bte-germany.de/logo.gif",
              },
            },
          ],
          attachments: [],
        });
      });
  }
};
