const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async function (interaction) {
  let roleID = await interaction.fields.fields.get("AbsenceRole").value;
  let emote = (await interaction.fields.fields.get("AbsenceEmoji").value) || "";

  // Check if the role exists in the database
  let prevcheck = await prisma.absenceRole.findFirst({
    where: { id: roleID.toString() },
  });

  // If the role exists, edit the role
  if (prevcheck !== null) {
    prisma.absenceRole.update({
      where: {
        id: roleID.toString(),
      },
      data: {
        emote: emote,
      },
    }).then(() => {
      return interaction.reply({
        content: "",
        embeds: [
          {
            title: "✅ | Successfully edited the role",
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

    }
    );
  } else {
    //error message

    return interaction.reply(
      {
        content: "",
        embeds: [
          {
            title: "❌ | The role could not be found",
            color: null,
            footer: {
              text: "BTE Teamtool",
              icon_url: "https://bte-germany.de/logo.gif"
            }
          }
        ],
        ephemeral: true
      }
    )
  }
};
