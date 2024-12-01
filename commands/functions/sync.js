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
          console.log(e);
        });
    } else {
      prisma.absenceUser
        .create({
          data: {
            id: member.user.id,
            roleID: highestRole.id,
            status: 0
          },
        })
        .then(async () => {
          console.log(`Successfully synced ${member.user.tag}`);
        })
        .catch(async (e) => {
          console.log(`Could not sync ${member.user.tag}`);
          console.log(e);
        });
    }
  });

  //look if any users are in the table that are not in the server
  let allUsers = await prisma.absenceUser.findMany();
  allUsers.forEach(async (user) => {
    //check if the user is in the server using the members collection we fetched earlier
    let test = members.get(user.id);
    if (test === undefined) {
      //if the user is not in the server, delete them from the table
      prisma.absenceUser
        .delete({
          where: {
            id: user.id,
          },
        })
        .then(async () => {
          console.log(`Successfully deleted ${user.id}`);
        })
        .catch(async (e) => {
          console.log(`Could not delete ${user.id}`);
          console.log(e);
        }
        );
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

  //look if any roles are in the table that are not in the server
  let allRoles = await prisma.absenceRole.findMany();
  allRoles.forEach(async (role) => {
    //check if the role is in the server using the roles collection we fetched earlier
    let test = guild.roles.cache.get(role.id);
    if (test === undefined) {
      //if the role is not in the server, delete them from the table
      prisma.absenceRole
        .delete({
          where: {
            id: role.id,
          },
        })
        .then(async () => {
          console.log(`Successfully deleted ${role.id}`);
        })
        .catch(async (e) => {
          console.log(`Could not delete ${role.id}`);
          console.log(e);
        }
        );
    }

  });


  //reply to the interaction
  await interaction.reply({
    content: "Synced all users and roles!",
    ephemeral: true,
  });
};
