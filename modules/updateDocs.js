const fs = require("fs");
const path = require("path");

module.exports = {
  /**
   * Update the docs
   * @param {Object} bot The Ch1llBlox bot Instance.
   * @param {Dirname} MainDir The main directory.
   */
  update(bot, MainDir) {
    let cmdCount = 0;

    bot.commands.each(() => ++cmdCount);

    let baseText = `# Commands\n\nCh1llBlox's Command List! Ch1llBlox contains more than **${cmdCount} commands**!\n\n`;

    bot.categories
      .sort((a, b) => {
        const aCmds = bot.commands.filter(c => {
          if (c) {
            return c.category === a;
          }
        });

        const bCmds = bot.commands.filter(c => {
          if (c) {
            return c.category === b;
          }
        });

        if (aCmds.length > bCmds.length) {
          return -1;
        } else {
          return 1;
        }
      })
      .forEach(cat => {
        const info = [];
        const cmds = bot.commands.filter(cmd => {
          if (cmd) {
            return cmd.category === cat.name;
          }
        });

        baseText += `## ${cat.name}\n\n`;

        info.push(["Name", "Description", "Usage", "Cooldown"]);

        cmds
          .sort((a, b) => {
            if (a.settings.name < b.settings.name) {
              return -1;
            } else {
              return 1;
            }
          })
          .forEach(cmd => {
            info.push([
              `**${cmd.settings.name || "Command name invalid."}**`,
              cmd.settings.description || "No description for this command",
              cmd.settings.usage.replaceAll("<", "{").replaceAll(">", "}") || "",
              `${Math.ceil(cmd.settings.cooldown / 1000)} seconds`,
            ]);
          });
        info;
        baseText += `${require("markdown-table")(info)}\n`;
      });

    fs.writeFileSync(path.join(`${MainDir}/docs/commands.md`), baseText);
    console.log("📋 | Successfully updated commands!");
  },
};
