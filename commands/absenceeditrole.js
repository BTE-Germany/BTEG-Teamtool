const { SlashCommandBuilder } = require("discord.js");
const modal = require("../modals/editRole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("absencerole")
    .setDescription("Add absence Role"),
  async execute(interaction) {
    interaction.showModal(modal.data);
  },
};
