import React from "react";
import Context from "./context";

export default class GlobalState extends React.Component {
    state = {
        selectedChatRoom: {}
    }


    updateSelectedChatRoom = (chatRoom) => {
        this.setState({
            selectedChatRoom: chatRoom
        })
    }

    render(){
        return (
            <Context.Provider
            value={{
                selectedChatRoom: this.state.selectedChatRoom,
                updateSelectedChatRoom: this.updateSelectedChatRoom
            }}
            >
                {this.props.children}
            </Context.Provider>
        )
    }

}