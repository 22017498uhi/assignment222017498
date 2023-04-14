import React, { useEffect, useState } from 'react';
import { firestore } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";



function HintsSection() {

    const questionId = "balances" // should be done through URL and routing with useParams()

    const [hintsData, setHintsData] = useState("")

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

            <div className="p-3 mb-2" style={{backgroundColor:'#ecf0f1'}}>
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
                        <div className="col-2 text-center" style={{alignSelf: 'center'}}>
                            <p>{rowObj.rowTitle}</p>
                        </div>

                        {/* Now iterate over each column and find out videos for it */}
                        {hintsData && hintsData?.titleColumn.map((columnObj) => (
                        <div className="col-5 text-center">
                            { hintsData?.video.map((videoObj) => ( 
                            <div >
                                { videoObj?.type == columnObj.linkTitle && videoObj?.link == rowObj.linkTitle 
                                && (
                                <div className="d-flex flex-column" style={{border: `2px solid ${videoObj?.type === 'general'? '#0d6efcb8': '#1987549c'}`, padding: '4px 4px 2px 4px', borderRadius:'5px'}}>
                                <button type="button"  name={videoObj.title} className={`btn mb-1 p-2 ${videoObj?.type === 'general'? 'btn-primary': 'btn-success'}`} > VIDEO</button>
                                <button type="button"  name={videoObj.title} className={`btn mb-1 p-2 ${videoObj?.type === 'general'? 'btn-primary': 'btn-success'}`} > SUMMARY</button>  
                                </div>
                                )}      
                            </div>
                            ))}
                        </div>
                    ))}




                    </div>
                ))}






            </div>
            {/* <div className="col-6 text-center">
                    <p>General</p>
                    <div className="mb-5 d-grid gap-2">
                        <button type="button" className="btn btn-primary mb-1 p-2">Primary</button>
                        <button type="button" className="btn btn-primary mb-1 p-2">Primary</button>
                    </div>
                    <div className="mb-5 d-grid gap-2">
                        <button type="button" className="btn btn-primary mb-1 p-2">Primary</button>
                        <button type="button" className="btn btn-primary mb-1 p-2">Primary</button>
                    </div>
                    <div className="mb-5 d-grid gap-2">
                        <button type="button" className="btn btn-primary mb-1 p-2">Primary</button>
                        <button type="button" className="btn btn-primary mb-1 p-2">Primary</button>
                    </div>
                </div>

                <div className="col-6 text-center">
                    <p>General</p>
                    <div className="mb-5 d-grid gap-2">
                        <button type="button" className="btn btn-success mb-1 p-2">Success</button>
                        <button type="button" className="btn btn-success mb-1 p-2">Success</button>
                    </div>
                    <div className="mb-5 d-grid gap-2">
                        <button type="button" className="btn btn-success mb-1 p-2">Success</button>
                        <button type="button" className="btn btn-success mb-1 p-2">Success</button>
                    </div>
                    <div className="mb-5 d-grid gap-2">
                        <button type="button" className="btn btn-success mb-1 p-2">Success</button>
                        <button type="button" className="btn btn-success mb-1 p-2">Success</button>
                    </div>
                </div> */}
        </div>


    )
}

export default HintsSection;