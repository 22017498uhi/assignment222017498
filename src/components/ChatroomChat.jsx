import React, { useEffect, useState, useContext } from 'react';

import { firestore, auth } from "../services/firebase";
import { collection, setDoc, onSnapshot, addDoc,query, doc,  getDoc, where } from "firebase/firestore";
import { Badge } from 'react-bootstrap';
import appContext from '../context/context';
import ChatSendMessage from './ChatSendMessage';

function ChatroomChat() {

const { selectedChatRoom, updateSelectedChatRoom } = useContext(appContext);
const { loggedInUser } = useContext(appContext);
const [chatMessages, setChatMessages] = useState([]);

//function called inside useEffect
const getFirebaseData = async () => {

    //fetch chat messages for a chatroom
    const chatroomDoc = doc(firestore, "chatrooms", selectedChatRoom.id);
    const chatroomQuery = query(collection(firestore, "chatmessages"), where("chatroom", "==", chatroomDoc));

    let promises = [];

    //listens for live changes
    onSnapshot(chatroomQuery, (snapshot) => {
        let chatMessagesLocalArr = [];

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
                //sort the data, oldest to newest
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])


const addToFAQ = async (adminChatMsg) => {
    
    //fist find end user's message above this admin's message
    //as it will be the question of FAQ and this admin's message will be Answer of FAQ

    //first find index of admin's message
    const indexOfAdminMsg = chatMessages.findIndex((ele) => {
        return ele.id === adminChatMsg.id
    })

    //now get message before this, assumption is that this will be end user's message
    const EndUserMsg = chatMessages[(indexOfAdminMsg - 1)]

    //now build the FAQ's object which will be stored in firestore
    const videoFAQObj = {
        faqQuestion: {
            text: EndUserMsg.text
        },
        faqAnswer: {
            text: adminChatMsg.text,
            imageURL: adminChatMsg.imageURL || ''
        },
        video: selectedChatRoom.video.title,
        question: selectedChatRoom.question
    }

    //now add above faq to firestore
    //add chat message under above chatroom
    addDoc(collection(firestore, "videofaqs"), (videoFAQObj)).then(() => {
        //set a flag indicating it's already added to FAQ.
        adminChatMsg.isAddedToFAQ = true;

        //store this flag on firestore so that next time this chat is opneed,
        //admin know's that FAQ is already added for this message.
        //setDoc - add if not there.. if already there ignore, if any change, update existing record.
        setDoc(doc(firestore, "chatmessages",
            adminChatMsg.id), ({ isAddedToFAQ: true }), { merge: true })

        //show confirmation message
        alert('FAQ added successfully!');

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
                        <div className={`chat-bubble flex-column align-items-center ${chatmsg.user.id === auth.currentUser.email ? "right" : ""}`}>

                            <div className='d-flex'>
                                <img
                                    className="chat-bubble__left"
                                    src={chatmsg.userDetails.photoURL}
                                    alt="user avatar"
                                />
                                <div className="chat-bubble__right">
                                    <p className="user-message"> {chatmsg.text}</p>
                                </div>
                            </div>

                            {chatmsg?.imageURL && <div>
                                <img alt='profile' style={{ width: '100%' }} src={chatmsg?.imageURL}></img>
                            </div>}


                            {/* Add to FAQs button */}
                            {!chatmsg?.isAddedToFAQ && loggedInUser?.isAdmin && chatmsg.user.id === auth.currentUser.email && <div>
                                <div className='mt-2 mb-1'>
                                    <button className='btn btn-outline-danger btn-sm'
                                        onClick={() => { addToFAQ(chatmsg) }}> Add to FAQ's</button>
                                </div>
                            </div>}

                            {/* Already added to FAQ message   */}
                            {chatmsg?.isAddedToFAQ && loggedInUser?.isAdmin && <div className='alert alert-light mb-0 p-1 mt-1'>
                                <span>Already added to FAQ's</span>
                            </div>}
                        </div>
                    </div>
                ))}
            </div>


            {/* send message part */}
            <div>
                <ChatSendMessage />
            </div>
        </div>

    </div>

)
}

export default ChatroomChat;