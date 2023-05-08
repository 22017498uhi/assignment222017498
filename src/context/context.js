import React from 'react';

export default React.createContext({
    
    selectedChatRoom: {},
    updateSelectedChatRoom: (chatroom) => {},

    loggedInUser: {},
    updateLoggedInUser: (userObj) => {}
})