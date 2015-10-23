var chat = {},
	//all users by IDS, users by Nicknames, rooms
	users = [{}, {}, {}];

// Handle deletion of user from a room
chat.addUser = function (room, user) {
	if (!(room in users)) {
		users[2][room] = [];
	}
	users[0][user[0].id] = user;
	users[1][user[1]] = user;
	users[2][room].push(user);
};

chat.getUserByName = function (name) {
	return users[1][name];
};

chat.getUsersNicknames = function (room) {
	var usersList = [],
		u;
	for (u in users[1][room]) {
		usersList.push(u[1]);
	}

	return usersList;
};

module.exports = chat;
