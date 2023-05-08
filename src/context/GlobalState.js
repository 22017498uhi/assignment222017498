import React from "react";
import Context from "./context";

export default class GlobalState extends React.Component {
    state = {
        selectedChatRoom: {},
        loggedInUser: {}
    }


    updateSelectedChatRoom = (chatRoom) => {
        this.setState({
            selectedChatRoom: chatRoom
        })
    }

    updateLoggedInUser = (userObj) => {
        this.setState({
            loggedInUser: userObj
        })
    }

    render(){
        return (
            <Context.Provider
            value={{
                selectedChatRoom: this.state.selectedChatRoom,
                updateSelectedChatRoom: this.updateSelectedChatRoom,
                loggedInUser: this.state.loggedInUser,
                updateLoggedInUser: this.updateLoggedInUser
            }}
            >
                {this.props.children}
            </Context.Provider>
        )
    }

}