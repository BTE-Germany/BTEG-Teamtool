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

  //look if any users are in the table that are not in the server or are bots
  let allUsers = await prisma.absenceUser.findMany();
  allUsers.forEach(async (user) => {
    //check if the user is in the server using the members collection we fetched earlier
    let test = members.get(user.id);
    if (test === undefined || test.user.bot) {
      //if the user is not in the server or is a bot, delete it from the table
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
    if (test === null) {
      {
        prisma.absenceRole
          .create({
            data: {
              id: highestRole.id,
              emote: "🤵",
              guild: guild.id,
            },
          })
          .then(async () => {
            console.log(`Successfully synced ${highestRole.name}`);
          })
          .catch(async (e) => {
            console.log(`Could not sync ${highestRole.name}`);
            console.log(e);
          });
      }
    }
  }
  );


  //look if any roles are in the table that are not in the server or have 0 users
  let allRoles = await prisma.absenceRole.findMany();
  allRoles.forEach(async (role) => {
    //check if the role is in the server using the roles collection we fetched earlier
    let test = guild.roles.cache.get(role.id);
    if (test === undefined) {
      //if the role is not in the server, delete it from the table
      prisma.absenceRole
        .delete({
          where: {
            id: role.id,
          },
        })
        .then(async () => {
          console.log(`Successfully deleted ${role.name}`);
        })
        .catch(async (e) => {
          console.log(`Could not delete ${role.name}`);
          console.log(e);
        }
        );
    } else {
      //if the role is in the server, check if it has 0 users
      let users = await prisma.absenceUser.findMany({
        where: {
          roleID: role.id,
        },
      });
      if (users.length === 0) {
        //if the role has 0 users, delete it from the table
        prisma.absenceRole
          .delete({
            where: {
              id: role.id,
            },
          })
          .then(async () => {
            console.log(`Successfully deleted ${role.name}`);
          })
          .catch(async (e) => {
            console.log(`Could not delete ${role.name}`);
            console.log(e);
          }
          );

      }
    }
  }
  );


  //sort roles in prisma table, using the order they came in from discord
  //use the same allroles variable from before
  let roleOrder = 0;
  allRoles.forEach(async (role) => {
    roleOrder++;
    prisma.absenceRole
      .update({
        where: {
          id: role.id,
        },
        data: {
          order: roleOrder,
        },
      })
      .then(async () => {
        console.log(`Successfully sorted ${role.name}`);
      })
      .catch(async (e) => {
        console.log(`Could not sort ${role.name}`);
        console.log(e);
      }
      );

  });


  //reply to the interaction
  await interaction.reply({
    content: "Synced all users and roles!",
    ephemeral: true,
  });
};
