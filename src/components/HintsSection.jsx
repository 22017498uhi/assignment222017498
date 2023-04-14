import React, { useEffect, useState } from 'react';
import { firestore, storage } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

import Popup from 'reactjs-popup';

import { ref, getDownloadURL } from "firebase/storage";






function HintsSection() {

    const questionId = "balances" // should be done through URL and routing with useParams()

    const [hintsData, setHintsData] = useState("")

    const [clickedButtonName, setClickedButtonName] = useState("")

    const [summaryImageUrl, setSummaryImageUrl] = useState("")
    const [videoUrl, setvideoUrl] = useState("")


    const [summaryPopupOpen, setSummaryPopupOpen] = useState(false);
    const [videoPopupOpen, setVideoPopupOpen] = useState(false);


    const closeSummaryModal = () => setSummaryPopupOpen(false);

    //function called inside useEffect
    const getFirebaseData = async () => {

        const questionsRef = doc(firestore, "Questions", questionId);

        const questionsDocSnap = await getDoc(questionsRef);

        if (questionsDocSnap.exists()) {
            const questionData = questionsDocSnap.data()
            console.log(questionData[questionId].hint);
            setHintsData(questionData[questionId].hint)

        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    useEffect(() => {

        getFirebaseData();

    }, [])


    return (
        <div className="col-sm">
            <h2 className="text-center">Hints</h2>

            <div className="p-3 mb-2" style={{ backgroundColor: '#ecf0f1' }}>
                <div className="row">

                    <div className="col-2 text-center"></div>

                    {/* iterate over titleColumn */}
                    {hintsData && hintsData.titleColumn.map((columnObj) => (
                        <div className="col-5 text-center">
                            <p className={`sda ${columnObj?.linkTitle === 'general' ? 'text-primary' : 'text-success'}`}>{columnObj.columnTitle}</p>
                        </div>
                    ))}
                </div>

                {/* iterate over each title - this will be our rows */}
                {hintsData && hintsData.title.map((rowObj) => (
                    <div className="row mb-2">
                        <div className="col-2 text-center" style={{ alignSelf: 'center' }}>
                            <p>{rowObj.rowTitle}</p>
                        </div>

                        {/* Now iterate over each column and find out videos for it */}
                        {hintsData && hintsData?.titleColumn.map((columnObj) => (
                            <div className="col-5 text-center">
                                {hintsData?.video.map((videoObj) => (
                                    <div >
                                        {videoObj?.type == columnObj.linkTitle && videoObj?.link == rowObj.linkTitle
                                            && (
                                                <div className="d-flex flex-column" style={{ border: `2px solid ${videoObj?.type === 'general' ? '#0d6efcb8' : '#1987549c'}`, padding: '4px 4px 2px 4px', borderRadius: '5px' }}>
                                                    <button type="button" name={videoObj.title} className={`btn mb-1 p-2 ${videoObj?.type === 'general' ? 'btn-primary' : 'btn-success'}`} > VIDEO</button>
                                                    <button type="button" name={videoObj.title} className={`btn mb-1 p-2 ${videoObj?.type === 'general' ? 'btn-primary' : 'btn-success'}`}
                                                        onClick={() => {

                                                            getDownloadURL(ref(storage, `quesimages/${videoObj.title}.jpg`))
                                                            .then((url) => {
                                                                setSummaryImageUrl(url);
                                                                setSummaryPopupOpen(o => !o)
                                                            });
                                                            
                                                        }

                                                        }> SUMMARY</button>
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        ))}




                    </div>
                ))}






            </div>

            {/* Popup code is below */}
            <Popup open={summaryPopupOpen} onClose={closeSummaryModal}>
                <div className="my-modal">
                    <a className="close" onClick={closeSummaryModal}>
                        &times;
                    </a>
                    <span><img style={{ maxWidth: '640px', maxHeight: '480px' }} src={summaryImageUrl}></img></span>
                </div>
            </Popup>


        </div>
    )
}

export default HintsSection;