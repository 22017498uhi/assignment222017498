import React, { useEffect, useState, useContext } from 'react';

import { app, firestore, auth, analytics, storage, database } from "../services/firebase";
import { QuerySnapshot, collection, getDocs, onSnapshot, addDoc, orderBy, query, doc, updateDoc, getDoc } from "firebase/firestore";
import { Badge, InputGroup,Form , Button} from 'react-bootstrap';
import chatContext from '../context/context';



function ChatroomChat() {

    const { selectedChatRoom, updateSelectedChatRoom } = useContext(chatContext);

    const [userText, setUserText] = useState("");

    //function called inside useEffect
    const getFirebaseData = async () => {

        console.log('single chatroom chat with messages');

        //fetch all chatrooms, sort by latest first
        const chatroomQuery = query(collection(firestore, "chatmessages"), orderBy("updatedAt", "asc"));

        onSnapshot(chatroomQuery, (snapshot) => {

        })
    }

    useEffect(() => {
        getFirebaseData();
    }, [])

    return (
        <div style={{ height: '100%' }}>
            {/* Chatroom Chat header */}
            <div style={{ height: '11%' }} className='iwse-chat-header d-flex flex-row justify-content-start align-items-center p-2 ' >
                <div className='me-3'>
                    <button className='btn btn-outline-dark btn-sm' onClick={() => { updateSelectedChatRoom({}) }}>
                        <span><i className="bi bi-arrow-left"></i></span>
                        <span> Back</span>
                    </button>
                </div>

                <div className='d-flex flex-row flex-fill justify-content-evenly'>
                    <div className='d-flex flex-column align-items-center me-3'>
                        <label>Question: </label> <span className='fw-bold'>{selectedChatRoom.questionDetails[selectedChatRoom.questionDetails.id].questions.title}</span>
                    </div>
                    <div className='d-flex flex-column align-items-center'>
                        <span><label>Video: </label></span>
                        <span><span className='fw-bold'>{selectedChatRoom.videoName.rowTitle} </span><span style={{ fontSize: '11px' }}><Badge bg="secondary">{selectedChatRoom.videoType.columnTitle}</Badge></span></span>
                    </div>
                </div>
            </div>


            {/* Chatroom Chat messages */}
            <div className='d-flex flex-column' style={{ height: '89%' }}>

                {/* chat messages list */}
                <div className='flex-fill'>
                    
                </div>

                {/* send message part */}
                <div>
                    <InputGroup className="" value={userText} onChange={(value) => {
                            setUserText(value.target.value)
                        }}>
                        <Form.Control
                            placeholder="Type your message..."
                            aria-label="Type your message..."
                            aria-describedby="send-message"
                        />
                        <Button variant="outline-primary" id="send-message">
                            Send
                        </Button>
                    </InputGroup>
                </div>
            </div>

        </div>

    )
}

export default ChatroomChat;