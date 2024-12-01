const { SlashCommandBuilder } = require("discord.js");
const execute = require("./functions/absenceremoveuser");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("absenceremoveuser")
    .setDescription("Remove absence user")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to remove").setRequired(true)
    ),
  async execute(interaction) {
    execute(interaction);
  },
};
