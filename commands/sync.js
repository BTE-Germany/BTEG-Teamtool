const { SlashCommandBuilder } = require("discord.js");
const execute = require("./functions/sync");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("syncabsence")
    .setDescription("Syncs users and roles for the absence system"),
  async execute(interaction) {
    await execute(interaction);
  },
};
