import React, { useEffect, useContext } from 'react';

import { Nav, Navbar } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { firestore, auth } from "../services/firebase";
import { doc, getDocFromServer } from "firebase/firestore";

import ChatWindow from './ChatWindow';
import appContext from '../context/context';


function HeaderNav() {

    const { updateLoggedInUser } = useContext(appContext); //updates logged in user when auth state changes, logged in user is used by other components

    const fetchLoggedInUserFirebase = async () => {

        auth.onAuthStateChanged(async (user) => {
            if (user) {

                setTimeout(async() => {
                    const userRef = doc(firestore, "users", user.email); //email is unique id for users collection
                    const userDoc = await getDocFromServer(userRef);
    
                    
                    if (userDoc.exists()) {
                        updateLoggedInUser(userDoc.data())
                    }
                },1000);
                
            } else {
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

                <Navbar className='mb-2 px-5 d-flex justify-content-between' style={{backgroundColor:'#ecf0f1'}} expand="lg">
                   
                    <Navbar.Brand href="#home">IWSE</Navbar.Brand>
                        <Nav className="d-flex flex-row justify-content-end"  activeKey="/home">

                            <Nav.Item>
                                <Nav.Link className='me-2' eventKey="chats">
                                    <OverlayTrigger trigger="click" placement="bottom-end" overlay={popover}>
                                        <div>Chats</div>
                                    </OverlayTrigger>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className='text-danger ms-2' onClick={() => {
                                    auth.signOut();
                                }}>
                                    Logout
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    
                </Navbar>

            </div>

        </div>
    )
}

export default HeaderNav;