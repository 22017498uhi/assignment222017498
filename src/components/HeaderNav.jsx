import React, { useEffect, useState, useContext } from 'react';

import { Nav, Button, Card, ListGroup, Badge } from 'react-bootstrap'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import { app, firestore, auth, analytics, storage, database } from "../services/firebase";
import { QuerySnapshot, collection, getDocs, onSnapshot, addDoc, orderBy, query, doc, updateDoc, getDoc } from "firebase/firestore";

import ChatWindow from './ChatWindow';

import appContext from '../context/context';



function HeaderNav() {

    const { loggedInUser, updateLoggedInUser } = useContext(appContext);


    const fetchLoggedInUserFirebase = async () => {

        auth.onAuthStateChanged(async (user) => {
            if(user){
                const userRef = doc(firestore, "users", user.email); //email is unique id for users collection
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    console.log('looged un user found')
                    console.log(userDoc.data())
                    updateLoggedInUser(userDoc.data())

                    
                }

            }else{
                //logout
                //clear global state
                updateLoggedInUser({})

            }
        })

    }

    useEffect(() => {
        fetchLoggedInUserFirebase();
    }, [])
    


    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Chat conversations</Popover.Header>
            
            <Popover.Body>
  
                 <ChatWindow />  

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
                        <Nav.Link   onClick={() => {
                            auth.signOut();
                        }}>
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