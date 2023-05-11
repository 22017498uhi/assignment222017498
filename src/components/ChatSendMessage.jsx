
import React, { useState, useContext } from 'react';

import { firestore, auth, storage } from "../services/firebase";
import { collection, addDoc, doc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import appContext from '../context/context';


function ChatSendMessage() {

const { selectedChatRoom } = useContext(appContext); //fetch selected chatroom from app context
const [localChatMsgImage, setLocalChatMsgImage] = useState(""); //stores image selected by the user
const [userText, setUserText] = useState(""); //stores text of message input text field


const sendMessage = async (event) => {
    //need preventdefault otherwise "Enter" key does not work. its some issue due to this component being part of "Popover" of react-bootstrap
    if (event)
        event.preventDefault();

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

        uploadBytes(localImageStorageRef, localChatMsgImage).then((snapshot) => {

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
                <div className='flex-fill border border-secondary rounded'>
                    <input className='form-control iwse-msg-input' type="text"
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