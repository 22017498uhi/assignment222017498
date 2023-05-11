

import React, { useEffect, useState, useContext } from 'react';

import { app, firestore, auth, analytics, storage, database } from "../services/firebase";
import { QuerySnapshot, collection, setDoc, onSnapshot, addDoc, orderBy, query, doc, updateDoc, getDoc, where, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { Badge, InputGroup, Button, Toast } from 'react-bootstrap';

import appContext from '../context/context';


function ChatSendMessage() {

    const { selectedChatRoom, updateSelectedChatRoom } = useContext(appContext);
    const { loggedInUser } = useContext(appContext);

    const [localChatMsgImage, setLocalChatMsgImage] = useState("");
    const [userText, setUserText] = useState("");


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



    return (

        <div>
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
    )
}


export default ChatSendMessage;