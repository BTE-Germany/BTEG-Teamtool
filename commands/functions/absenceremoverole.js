const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async function (interaction) {
  let test = await prisma.absenceRole.findFirst({
    where: {
      id: interaction.options.get("role").role.id,
    },
  });
  if (test !== null) {
    prisma.absenceRole
      .delete({
        where: {
          id: interaction.options.get("role").role.id,
        }
      })
      .then(async () => {
        await interaction.reply({
          content: null,
          embeds: [
            {
              title: "✅ | Successfully removed this role!",
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
      }
      )

    } else {
      await interaction.reply({
        content: null,
        embeds: [
          {
            title:
              "❌ | Could not remove this role. Please try again later!",
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
    }
};
