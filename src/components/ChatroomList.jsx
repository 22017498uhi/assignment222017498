import React, { useEffect, useState, useContext } from 'react';

import { app, firestore, auth, analytics, storage, database } from "../services/firebase";
import { QuerySnapshot, collection, getDocs, onSnapshot, addDoc, orderBy, query, doc, updateDoc, getDoc, where } from "firebase/firestore";
import { Nav, Button, Card, ListGroup, Badge } from 'react-bootstrap'

import appContext from '../context/context';

function ChatroomList() {

    const [chatRooms, setChatRooms] = useState([]);

    const {updateSelectedChatRoom} = useContext(appContext);

    const { loggedInUser } = useContext(appContext);


    //function called inside useEffect
    const getFirebaseData = async () => {

        let chatroomQuery;

        //fetch all chatrooms, sort by latest first
       
        if(loggedInUser?.isAdmin){
             chatroomQuery = query(collection(firestore, "chatrooms")); //fetch all chat rooms
        }else{
             const userDoc = doc(firestore, "users", loggedInUser.email); //fetch logged in user document
             chatroomQuery = query(collection(firestore, "chatrooms"),where("user", "==", userDoc)); //fetch only logged in user's
        }
        
        onSnapshot(chatroomQuery, (snapshot) => {

            let chatRoomsLocalArr = [];
            let promises = [];

            snapshot.docs.forEach(async (doc) => {

                var finalChatroomObj = {}

                //fetch user details
                let userDoc = getDoc(doc.data().user);
                promises.push(userDoc);

                //fetch question details
                let questionDoc = getDoc(doc.data().question);
                promises.push(questionDoc);

                finalChatroomObj = {
                    id: doc.id,
                    ...doc.data(),
                    userDetails: await userDoc.then((d) => d.data()),
                    updatedAtDate: doc.data().updatedAt.toDate(),
                    questionDetails: await questionDoc.then((d) => {
                        return {
                            id: d.id,
                            ...d.data()
                        }
                    }),

                }

                chatRoomsLocalArr.push(finalChatroomObj);
            })

            Promise.all(promises).then(() => {

                setTimeout(() => {
                    chatRoomsLocalArr.forEach((chatroomObj) => {
                        chatroomObj.videoName = chatroomObj.questionDetails.balances.hint.title.find((ele) => ele.linkTitle == chatroomObj.video.link);
                        chatroomObj.videoType = chatroomObj.questionDetails.balances.hint.titleColumn.find((ele) => ele.linkTitle == chatroomObj.video.type);
                    })

                      //sort the chatrooms newest to oldest. firebase doesnot support sort when query is on differnt field. i.e user
                      chatRoomsLocalArr.sort((a, b) => {
                        return ((new Date(b.updatedAtDate).valueOf()) - (new Date(a.updatedAtDate).valueOf()));
                    })

                    setChatRooms(chatRoomsLocalArr)
                })


            })

        })

    }

    useEffect(() => {
        getFirebaseData();
    }, [])


    return (
            <div className='iwse-chatroom-wrapper'>
               
                <ListGroup variant='flush'>
                    {chatRooms && chatRooms.map((chatroomObj) => (
                        <ListGroup.Item key={chatroomObj.id} onClick={() => { updateSelectedChatRoom(chatroomObj) }}>
                            <div>
                                {loggedInUser?.isAdmin && <div className="user-info">
                                    <img src={chatroomObj.userDetails.photoURL} alt="User 1" />
                                    <span className="user-name">{chatroomObj.userDetails.displayName}</span>
                                </div> }
                                <div>
                                    <div><label >Question: </label>
                                        <span className=' fw-bold'>{chatroomObj.questionDetails[chatroomObj.questionDetails.id].questions.title}</span></div>
                                    <div>
                                        <label>Video: </label>
                                        <span className='me-2  fw-bold'>{chatroomObj.videoName.rowTitle}</span>
                                        <span style={{ fontSize: '11px' }}><Badge bg="secondary">{chatroomObj.videoType.columnTitle}</Badge></span></div>
                                    </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
    )

}
                    

export default ChatroomList;