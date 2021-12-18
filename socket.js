const socketChat = (Server) => {
	let users = [];

	const addUser = (userId, socketId) => {
		!users.some(user => user.userId === userId) &&
			users.push({ userId, socketId });
	};

	const removeUser = socketId => {
		users = users.filter(user => user.socketId !== socketId);
	};

	const getUser = userId => {
		return users.find(user => user.userId === userId);
	};

	let io = require('socket.io')(Server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST']
		}
	});

	io.on('connection', socket => {
		console.log('User is connected', socket.id);
		//take userId and socketId from user
		socket.on('addUser', userId => {
			if (userId) {
				addUser(userId, socket.id);
			}
			io.emit('getUsers', users);
			// console.log(users);
		});

		//send and get message
		socket.on('sendMessage', (receiverId, senderId, text) => {
			// console.log(senderId);
			// console.log(receiverId);
			// console.log(users);
			const user = getUser(receiverId);
			// console.log(user);
			io.to(user.socketId).emit('getMessage', {
				sender: senderId,
				text
			});
		});

		//when disconnect
		socket.on('disconnect', () => {
			console.log('a user disconnected!');
			removeUser(socket.id);
			io.emit('getUsers', users);
		});
	});
};

module.exports = socketChat