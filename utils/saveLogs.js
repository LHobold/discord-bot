const path = require("path");
const fs = require("fs").promises;
const logsPath = path.resolve(__dirname, "../logs/userStatusLog.json");

exports.default = async (newMember) => {
  const userLogs = require(logsPath);

  const userLogObj = {
    id: newMember.user.id,
    name: newMember.user.username,
    leftAt: new Date().getTime(),
  };

  const userIndex = userLogs.users.findIndex((u) => u.id === userLogObj.id);

  userIndex === -1
    ? userLogs.users.push(userLogObj)
    : (userLogs.users[userIndex] = userLogObj);

  await fs.writeFile(logsPath, JSON.stringify(userLogs));
};
