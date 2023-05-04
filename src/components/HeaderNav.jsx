//import firebase from "firebase/app";
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

function HeaderNav() {

    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Popover right</Popover.Header>
          <Popover.Body>
            And here's some <strong>amazing</strong> content. It's very engaging.
            right?
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
                            <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
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