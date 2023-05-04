import React, { useEffect, useState } from 'react';

import { Nav, Button, Card, ListGroup, Badge } from 'react-bootstrap'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import { app, firestore, auth, analytics, storage, database } from "../services/firebase";
import { QuerySnapshot, collection, getDocs, onSnapshot, addDoc, orderBy, query, doc, updateDoc, getDoc } from "firebase/firestore";

import './ChatWindow.scss'
import { click } from '@testing-library/user-event/dist/click';

function HeaderNav() {

    const [chatRooms, setChatRooms] = useState([])


    //function called inside useEffect
    const getFirebaseData = async () => {

        //fetch all chatrooms, sort by latest first
        const chatroomQuery = query(collection(firestore, "chatrooms"), orderBy("updatedAt", "desc"));

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
                    questionDetails: await questionDoc.then((d) => {
                        return {
                            id:d.id,
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

                    setChatRooms(chatRoomsLocalArr)
                })
              
                
            })

        })

    }

    useEffect(() => {
        getFirebaseData();
    }, [])

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Chat conversations</Popover.Header>
            {/* Admin view */}
            <Popover.Body>
                <div className='iwse-chatroom-wrapper'>
                    <ListGroup variant='flush'>
                        {chatRooms && chatRooms.map((chatroomObj) => (
                            <ListGroup.Item key={chatroomObj.id} onClick={() => {console.log('cliucked')}}>
                                <div>
                                    <div className="user-info">
                                        <img src={chatroomObj.userDetails.photoURL} alt="User 1" />
                                        <span className="user-name">{chatroomObj.userDetails.displayName}</span>
                                    </div>
                                    <div>
                                        <div><label >Question: </label><span className=' fw-bold'>{chatroomObj.questionDetails[chatroomObj.questionDetails.id].questions.title}</span></div>
                                        <div><label>Video: </label><span className='me-2  fw-bold'>{chatroomObj.videoName.rowTitle}</span><span style={{fontSize:'11px'}}><Badge  bg="secondary">{chatroomObj.videoType.columnTitle}</Badge></span></div>
                                        {/* <div><span>Video type: </span><span>{chatroomObj.videoType.columnTitle}</span></div> */}
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </Popover.Body>
        </Popover>
    );


    return (
        <div>
            <div>

                <Nav className="justify-content-end" activeKey="/home">
                    {/* <Nav.Item>
                        <Nav.Link href="/home">Home</Nav.Link>
                    </Nav.Item> */}
                    <Nav.Item>
                        <Nav.Link eventKey="chats">
                            <OverlayTrigger trigger="click" placement="bottom-end" overlay={popover}>
                                <div>Chats</div>
                            </OverlayTrigger>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link  >
                            Logout
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

            </div>

            {/* call chats component which actually shows chat data */}


        </div>
    )
}

export default HeaderNav;