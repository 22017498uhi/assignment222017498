import React, { useEffect, useState, useContext } from 'react';

import { app, firestore, auth, analytics, storage, database } from "../services/firebase";
import { QuerySnapshot, collection, setDoc, onSnapshot, addDoc, orderBy, query, doc, updateDoc, getDoc, where, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { Badge, InputGroup, Button, Toast } from 'react-bootstrap';
import appContext from '../context/context';



function ChatroomChat() {

    const { selectedChatRoom, updateSelectedChatRoom } = useContext(appContext);

    const { loggedInUser } = useContext(appContext);

    console.log(loggedInUser);


    const [chatMessages, setChatMessages] = useState([]);

    const [localChatMsgImage, setLocalChatMsgImage] = useState("");
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


        let chatmessageObj = {
            chatroom: doc(firestore, "chatrooms", selectedChatRoom.id),
            text: userText,
            user: doc(firestore, "users", auth?.currentUser?.email), //email is key for users collection
            updatedAt: Timestamp.fromDate(new Date()) //store current time
        }

        if (localChatMsgImage) {

            //if there is an image, insert into firebase storage.
            var localImageName = `chatimages/${auth.currentUser.email}_${new Date().getTime()}_${localChatMsgImage.name}`;
            const localImageStorageRef = ref(storage, localImageName);

            const uploadTask = uploadBytes(localImageStorageRef, localChatMsgImage).then((snapshot) => {
                console.log('Uploaded a blob or file!');

                getDownloadURL(ref(storage, localImageName)).then((url) => {
                    //set image into message obj
                    chatmessageObj.imageURL = url;

                    //add message into firestore
                    addDoc(collection(firestore, "chatmessages"), (chatmessageObj)).then(() => {
                        setUserText("");
                    })
                })
            });

        } else {
            //add chat message under above chatroom
            addDoc(collection(firestore, "chatmessages"), (chatmessageObj)).then(() => {
                setUserText("");
            })
        }
    }

    const addToFAQ = async (adminChatMsg) => {
        console.log(adminChatMsg);

        //fist find end user's message above this admin's message
        //as it will be the question of FAQ and this admin's message will be Answer of FAQ

        //first find index of admin's message
        const indexOfAdminMsg = chatMessages.findIndex((ele) => {
            return ele.id == adminChatMsg.id
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

            //show toast message
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
                                    <img style={{ width: '100%' }} src={chatmsg?.imageURL}></img>
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
                <div className='d-flex flex-row'>

                    <form className='flex-fill ' onSubmit={(e) => { sendMessage(e) }}>
                        <div className='flex-fill'>
                            <input className='form-control ' type="text"
                                value={userText} onChange={(value) => {
                                    setUserText(value.target.value)
                                }} onKeyDown={(e) => { e.stopPropagation() }} />

                            <div className='iwse-add-image'>

                                <input id="iwse-file-upload" type="file" onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                        const image = e.target.files[0]
                                        console.log(image);
                                        setLocalChatMsgImage(image);
                                    }} />

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