import React, { useEffect, useState } from 'react';
import { firestore } from "../services/firebase";

import { doc, getDoc } from "firebase/firestore";



function QuestionSection() {

const [title, setTitle] = useState("")
const [questionText, setQuestionText] = useState("")
const [imageUri, setImageUri] = useState("")
const questionId = "balances" // should be done through URL and routing with useParams()


//function called inside useEffect
const getFirebaseData = async () => {
    const questionsRef = doc(firestore, "Questions", questionId);

    const questionsDocSnap = await getDoc(questionsRef);

    if (questionsDocSnap.exists()) {
        const questionData = questionsDocSnap.data()
        console.log(questionData);
        setTitle(questionData[questionId][questionId].questions.title)
        setQuestionText(questionData[questionId][questionId].questions.fullquestion.question)
        setImageUri(questionData[questionId][questionId].questions.fullquestion.questionImage)
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

useEffect( () => {

    getFirebaseData();

},[])


return (
    <div className="col-sm">
        <h3 className="text-center">{title}</h3>
        <div className="p-3 mb-2 bg-light">
            <div className="text-center">
            <img className="mb-4 rounded img-fluid" src={imageUri} />
            </div>
            <p>{questionText}</p>
        </div>
    </div>
)
}

export default QuestionSection;