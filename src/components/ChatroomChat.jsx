import React, { useEffect, useState, useContext } from 'react';

import { app, firestore, auth, analytics, storage, database } from "../services/firebase";
import { QuerySnapshot, collection, getDocs, onSnapshot, addDoc, orderBy, query, doc, updateDoc, getDoc, where, Timestamp } from "firebase/firestore";
import { Badge, InputGroup, Button } from 'react-bootstrap';
import chatContext from '../context/context';



function ChatroomChat() {

    const { selectedChatRoom, updateSelectedChatRoom } = useContext(chatContext);

    const [chatMessages, setChatMessages] = useState([]);

    const [userText, setUserText] = useState("");

    //function called inside useEffect
    const getFirebaseData = async () => {

        console.log(selectedChatRoom);

        console.log('single chatroom chat with messages');

        //fetch all chatrooms, sort by latest first

        const chatroomDoc = doc(firestore, "chatrooms", selectedChatRoom.id);
        const chatroomQuery = query(collection(firestore, "chatmessages"), where("chatroom", "==", chatroomDoc));


        let promises = [];


        onSnapshot(chatroomQuery, (snapshot) => {
            let chatMessagesLocalArr = [];

            snapshot.docChanges()

            snapshot.docs.forEach(async (doc) => {
                var chatMessageObj = {}

                //fetch user details
                let userDoc = getDoc(doc.data().user);
                promises.push(userDoc);

                chatMessageObj = {
                    id: doc.id,
                    ...doc.data(),
                    userDetails: await userDoc.then((d) => d.data()),
                    updatedAtDate: doc.data().updatedAt.toDate()
                }

                chatMessagesLocalArr.push(chatMessageObj);
            })

            Promise.all(promises).then(() => {
                setTimeout(() => {


                    //sort the messages oldest to newest. firebase doesnot support sort when query is on differnt field. i.e chatrooms
                    //sort the data, newest posts at top
                    chatMessagesLocalArr.sort((a, b) => {
                        return ((new Date(a.updatedAtDate).valueOf()) - (new Date(b.updatedAtDate).valueOf()));
                    })

                    setChatMessages(chatMessagesLocalArr)
                })
            })
        })
    }

    useEffect(() => {
        getFirebaseData();
    }, [])


    const sendMessage = async (event) => {
        if (event)
            event.preventDefault();

        console.log('submitted');

        const chatmessageObj = {
            chatroom: doc(firestore, "chatrooms", selectedChatRoom.id),
            text: userText,
            user: doc(firestore, "users", auth?.currentUser?.email), //email is key for users collection
            updatedAt: Timestamp.fromDate(new Date()) //store current time
        }
        //now add chat message under above chatroom
        addDoc(collection(firestore, "chatmessages"), (chatmessageObj)).then(() => {
            setUserText("");
        })


    }

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
                <div className='flex-fill p-2 ps-3 iwse-chatmsg-container'>
                    {chatMessages.map((chatmsg) => (
                        <div key={chatmsg.id} className={`d-flex ${chatmsg.user.id === auth.currentUser.email ? "justify-content-end" : ""}`} >
                            <div
                                className={`chat-bubble ${chatmsg.user.id === auth.currentUser.email ? "right" : ""}`}>
                                <img
                                    className="chat-bubble__left"
                                    src={chatmsg.userDetails.photoURL}
                                    alt="user avatar"
                                />
                                <div className="chat-bubble__right">
                                    <p className="user-name">{chatmsg?.name}</p>
                                    <p className="user-message"> {chatmsg.text}</p>
                                </div>
                            </div>

                        </div>

                    ))}
                </div>



                {/* send message part */}
                <div className='d-flex flex-row'>

                    <form className='flex-fill ' onSubmit={(e) => { sendMessage(e) }}>
                        <div className='flex-fill'>
                            <input className='form-control ' type="text"
                                value={userText} onChange={(value) => {
                                    setUserText(value.target.value)
                                }} onKeyDown={(e) => { e.stopPropagation() }} />

                            <div className='iwse-add-image'>

                                <input id="iwse-file-upload" type="file" onClick={(e) => e.stopPropagation()} />

                            </div>
                        </div>


                    </form>
                    <button className='btn btn-outline-primary' type="button" onClick={sendMessage} >Send</button>


                </div>
            </div>

        </div>

    )
}

export default ChatroomChat;