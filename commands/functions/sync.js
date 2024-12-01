const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async function (interaction) {
  //sync all users and get their highest role
  let guild = interaction.guild;
  let members = await guild.members.fetch();
 
  console.log("Syncing all users and roles...");

  members.forEach(async (member) => {
    console.log("Syncing user: " + member.user.tag);
    let highestRole = member.roles.highest;
    let test = await prisma.absenceUser.findFirst({
      where: {
        id: member.user.id,
      },
    });
    if (test !== null) {
      prisma.absenceUser
        .update({
          where: {
            id: member.user.id,
          },
          data: {
            roleID: highestRole.id,
          },
        })
        .then(async () => {
          console.log(`Successfully synced ${member.user.tag}`);
        })
        .catch(async (e) => {
          console.log(`Could not sync ${member.user.tag}`);
        });
    } else {
      prisma.absenceUser
        .create({
          data: {
            id: member.user.id,
            roleID: highestRole.id,
          },
        })
        .then(async () => {
          console.log(`Successfully synced ${member.user.tag}`);
        })
        .catch(async (e) => {
          console.log(`Could not sync ${member.user.tag}`);
        });
    }
  });

  //sync all the highest roles to the roles table
  members.forEach(async (member) => {
    let highestRole = member.roles.highest;
    let test = await prisma.absenceRole.findFirst({
      where: {
        id: highestRole.id,
      },
    });
    if (test !== null) {
      prisma.absenceRole
        .update({
          where: {
            id: highestRole.id,
          },
          data: {
            name: highestRole.name,
          },
        })
        .then(async () => {
          console.log(`Successfully synced ${highestRole.name}`);
        })
        .catch(async (e) => {
          console.log(`Could not sync ${highestRole.name}`);
        });
    } else {
      prisma.absenceRole
        .create({
          data: {
            id: highestRole.id,
            name: highestRole.name,
          },
        })
        .then(async () => {
          console.log(`Successfully synced ${highestRole.name}`);
        })
        .catch(async (e) => {
          console.log(`Could not sync ${highestRole.name}`);
        });
    }
  });

  //reply to the interaction
  await interaction.reply({
    content: "Synced all users and roles!",
    ephemeral: true,
  });
};
