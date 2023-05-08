import React, { useEffect, useState } from 'react';
import { app, firestore, auth, analytics, storage, database } from "../services/firebase";
import { doc, getDoc, setDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import Popup from 'reactjs-popup';
import ReactPlayer from 'react-player'
import { ref, getDownloadURL } from "firebase/storage";

import Alert from 'react-bootstrap/Alert';




function HintsSection() {

    const questionId = "balances" // should be done through URL and routing with useParams()
    const [hintsData, setHintsData] = useState("")
    const [summaryImageUrl, setSummaryImageUrl] = useState("") //URL of current image on popup
    const [videoUrl, setVideoUrl] = useState("") //URL of current video on popup
    const [selectedVideoObj, setSelectedVideoObj] = useState({}) // data of video currently shown on popup
    const [summaryPopupOpen, setSummaryPopupOpen] = useState(false); //flag to indicate if summary popup is open
    const [videoPopupOpen, setVideoPopupOpen] = useState(false); //flag to indicate if video popup is open
    const [showConfusedForm, setShowConfusedForm] = useState(false); //flag to indicate if confused button is clicked or not
    const [confusedText, setConfusedText] = useState("") // data of video currently shown on popup
    const [confusedMsgSubmitted, setConfusedMsgSubmitted] = useState(false) // flag to indicate confused message submission status


    const closeSummaryModal = () => setSummaryPopupOpen(false);

    const closeVideoModal = () => {
        setVideoPopupOpen(false); //close popup
        setConfusedText(""); //reset textarea on confused form
        setShowConfusedForm(false) //also reset the confused button
        setConfusedMsgSubmitted(false)
        setConfusedMsgSubmitted(false);
    }

    //function called inside useEffect
    const getFirebaseData = async () => {

        const questionsRef = doc(firestore, "Questions", questionId);
        const questionsDocSnap = await getDoc(questionsRef);

        if (questionsDocSnap.exists()) {
            const questionData = questionsDocSnap.data()
            setHintsData(questionData[questionId].hint)
        } else {
            console.log("No such document!");
        }
    }

    useEffect(() => {
        getFirebaseData();
    }, [])


    const sendConfusedMessageDB = async () => {
        console.log(selectedVideoObj);
        console.log(confusedText);
        console.log(auth?.currentUser?.uid);

        //first add chatroom
        const chatRoomObj = {
            user: doc(firestore, "users", auth?.currentUser?.email),
            video: selectedVideoObj,
            question: doc(firestore, "Questions", questionId),
            updatedAt : Timestamp.fromDate(new Date()) //store current time
        }

        //setDoc - add if not there.. if already there ignore, if any change, update existing record.
        const chatRoomId = `${auth?.currentUser?.uid}_${questionId}_${selectedVideoObj.title}`;

        setDoc(doc(firestore, "chatrooms",
            chatRoomId), (chatRoomObj), { merge: true }).then(() => {
                //once chatroom is created, add user's message and link with above chatroom
                const chatmessageObj = {
                    chatroom: doc(firestore, "chatrooms", chatRoomId),
                    text: confusedText,
                    user: doc(firestore, "users", auth?.currentUser?.email), //email is key for users collection
                    updatedAt : Timestamp.fromDate(new Date()) //store current time
                }
                //now add chat message under above chatroom
                addDoc(collection(firestore, "chatmessages"), (chatmessageObj)).then(() => {
                    //once both chatroom and chat message is created, set flags to indicate status
                    setConfusedMsgSubmitted(true);
                })

            })
    }

    return (
        <div className="col-sm">
            <h2 className="text-center">Hints</h2>

         
         

            <div className="p-3 mb-2" style={{ backgroundColor: '#ecf0f1' }}>

                <div className="row">
                    {/* its blank div as header has only two elements whereas rows are three */}
                    <div className="col-2 text-center"></div>

                    {/* iterate over titleColumn */}
                    {hintsData && hintsData.titleColumn.map((columnObj) => (
                        <div key={columnObj.linkTitle} className="col-5 text-center">
                            <p className={`sda ${columnObj?.linkTitle === 'general' ? 'text-primary' : 'text-success'}`}>{columnObj.columnTitle}</p>
                        </div>
                    ))}
                </div>

                {/* iterate over each title - this will be our rows */}
                {hintsData && hintsData.title.map((rowObj) => (
                    <div key={rowObj.rowTitle} className="row mb-2">
                        <div className="col-2 text-center" style={{ alignSelf: 'center' }}>
                            <p>{rowObj.rowTitle}</p>
                        </div>

                        {/* Now iterate over each column and find out videos for it */}
                        {hintsData && hintsData?.titleColumn.map((columnObj) => (
                            <div key={columnObj.linkTitle} className="col-5 text-center">
                                {hintsData?.video.map((videoObj, $index) => (
                                    <div key={$index}>
                                        {videoObj?.type == columnObj.linkTitle && videoObj?.link == rowObj.linkTitle
                                            && (
                                                <div className="d-flex flex-column" style={{ border: `2px solid ${videoObj?.type === 'general' ? '#0d6efcb8' : '#1987549c'}`, padding: '4px 4px 2px 4px', borderRadius: '5px' }}>
                                                    <button type="button" name={videoObj.title}
                                                        className={`btn mb-1 p-2 ${videoObj?.type === 'general' ? 'btn-primary' : 'btn-success'}`}
                                                        onClick={() => {
                                                            getDownloadURL(ref(storage, `quesvideos/${videoObj.title}.mp4`))
                                                                .then((url) => {
                                                                    setVideoUrl(url);
                                                                    setSelectedVideoObj(videoObj);
                                                                    setVideoPopupOpen(o => !o)
                                                                });
                                                        }}>VIDEO</button>

                                                    <button type="button" name={videoObj.title}
                                                        className={`btn mb-1 p-2 ${videoObj?.type === 'general' ? 'btn-primary' : 'btn-success'}`}
                                                        onClick={() => {
                                                            getDownloadURL(ref(storage, `quesimages/${videoObj.title}.jpg`))
                                                                .then((url) => {
                                                                    setSummaryImageUrl(url);
                                                                    setSummaryPopupOpen(o => !o)
                                                                });
                                                        }}>SUMMARY</button>
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>


            {/* Summary Button Popup code is below */}
            <Popup lockScroll repositionOnResize open={summaryPopupOpen} onClose={closeSummaryModal}>
                <div className="my-modal">
                    <a className="close" onClick={closeSummaryModal}>
                        &times;
                    </a>
                    <span><img style={{ maxWidth: '640px', maxHeight: '480px' }} src={summaryImageUrl}></img></span>
                </div>
            </Popup>

            {/* Video Button Popup code is below */}
            <Popup lockScroll repositionOnResize open={videoPopupOpen} onClose={closeVideoModal}>
                <div className="my-modal my-2" style={{ width: '640px' }}>
                    <a className="close" onClick={closeVideoModal}>
                        &times;
                    </a>
                    <div><ReactPlayer url={videoUrl} playing={true} width={640} height="50vh" controls={true} /></div>
                    <div className='d-flex justify-content-end my-2 mx-3'>
                        {!showConfusedForm && <button className='btn btn-danger' onClick={() => {
                            setShowConfusedForm(true)
                        }}>Confused?</button>}
                    </div>

                    {/* Confused question posting stuff below */}
                    {!confusedMsgSubmitted && showConfusedForm && <div className='mx-3'>
                        <div>What have you found confusing about this video?</div>
                        <textarea className="form-control" style={{ borderColor: 'grey' }} id="videoquerytext" rows="2"
                            value={confusedText} onChange={(value) => {
                                setConfusedText(value.target.value)
                            }}></textarea>

                        <div className='mt-3'>
                            <button className='btn btn-primary me-3' onClick={sendConfusedMessageDB}>Send</button>
                            <button className='btn btn-outline-dark' onClick={() => {
                                setShowConfusedForm(false)
                            }}>Cancel</button>
                        </div>

                    </div>}

                    {/* Confused message submitted */}
                        <Alert show={confusedMsgSubmitted} variant="success">
                        <Alert.Heading> Your message was sent,and you will get a reply within 3 days.</Alert.Heading>
                            </Alert>
                    {/* <div className='bg-body-secondary border border-secondary-subtle text-center fs-4 text-wrap p-2'>Your message was sent,and you will get a reply within 3 days.</div> */}
                </div>
            </Popup>


        </div>
    )
}

export default HintsSection;