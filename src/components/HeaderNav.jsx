import React, { useEffect, useContext } from 'react';

import { Nav } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { firestore, auth } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

import ChatWindow from './ChatWindow';
import appContext from '../context/context';


function HeaderNav() {

    const {  updateLoggedInUser } = useContext(appContext); //updates logged in user when auth state changes, logged in user is used by other components

    const fetchLoggedInUserFirebase = async () => {

        auth.onAuthStateChanged(async (user) => {
            if(user){
                const userRef = doc(firestore, "users", user.email); //email is unique id for users collection
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

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

        </div>
    )
}

export default HeaderNav;