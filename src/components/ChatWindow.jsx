import { useContext, useEffect, useState } from "react";
import './ChatWindow.scss'

import ChatroomList from "./ChatroomList";
import ChatroomChat from "./ChatroomChat";


import context from '../context/context';

function ChatWindow() {

    const { selectedChatRoom } = useContext(context)


    return (

        <div style={{height:'100%'}}>
            

            {Object.entries(selectedChatRoom).length == 0  && <ChatroomList /> }

            {Object.entries(selectedChatRoom).length > 0  && <ChatroomChat />}

        </div>
    )

}

export default ChatWindow;