const { io } = require('../server');

const safeGetAttributeAtIndex = (arr, index, attribute) => {
  if (arr && Array.isArray(arr) && arr.length > index) {
    return arr[index][attribute];
  }
};

const interpretMsg = (actionObj) => {
  let interpretedMsg = `action: ${actionObj.action}, `;

  let targetLabel;
  if (actionObj.result.length === 0) {
    targetLabel = 'target: none, ';
  } else if (actionObj.result.length === 1) {
    targetLabel = 'target: ';
  } else {
    targetLabel = 'targets: ';
  }

  interpretedMsg += targetLabel;

  actionObj.result.forEach((result) => {
    if (result.objectName) {
      interpretedMsg += `${result.objectName}, `;
    }
  });

  if (actionObj.action === 'move') {
    const destination = safeGetAttributeAtIndex(actionObj.result, 0, 'destination');
    interpretedMsg += `destination: ${destination || 'none'}, `;
  }

  return interpretedMsg.slice(0, interpretedMsg.length - 2);
};

const parseActionResults = (socket, message, actionResults) => {
  const failActionText = {
    type: 'flavor',
    time: message.time,
    commenter: message.commenter,
    text: 'You can\'t do that.',
  };

  actionResults.forEach((actionObj) => {
    const actionMsg = {
      type: 'interpreted',
      time: message.time,
      commenter: message.commenter,
      text: interpretMsg(actionObj),
    };

    io.in(socket.currentRoom).emit('chatMessage', actionMsg);

    if (!actionObj.action || !actionObj.result || !actionObj.result.length) {
      return io.in(socket.currentRoom).emit('chatMessage', failActionText);
    }

    actionObj.result.forEach((item) => {
      // 'successful' must be explicitly set to false
      // or else the action should be assumed to be successful
      if (!item.text && item.successful === false) {
        return io.in(socket.currentRoom).emit('chatMessage', failActionText);
      }
      if (!item.text) {
        return;
      }

      const flavorText = {
        type: 'flavor',
        time: message.time,
        commenter: message.commenter,
        text: item.text,
      };

      io.in(socket.currentRoom).emit('chatMessage', flavorText);
    });
  });
};

module.exports = {
  parseActionResults,
};
