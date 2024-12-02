const { SlashCommandBuilder } = require("discord.js");
const execute = require("./functions/absenceremoverole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("absenceremoverole")
    .setDescription("Remove a role from the absence list")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want to remove")
        .setRequired(true)
    ),
  async execute(interaction) {
    execute(interaction);
  },
};
