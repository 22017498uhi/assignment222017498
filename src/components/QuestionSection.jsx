import React, { useEffect, useState } from 'react';
import { firestore } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

function QuestionSection() {

const [title, setTitle] = useState("") //stores title of the question
const [questionText, setQuestionText] = useState("") //stores summary text
const [imageUri, setImageUri] = useState("") //stores image of the question

const questionId = "balances" // should be done through URL and routing with useParams()

//function called inside useEffect
const getFirebaseData = async () => {

    const questionsRef = doc(firestore, "Questions", questionId);
    const questionsDocSnap = await getDoc(questionsRef);

    if (questionsDocSnap.exists()) {
        const questionData = questionsDocSnap.data()
        setTitle(questionData[questionId].questions.title)
        setQuestionText(questionData[questionId].questions.fullquestion.question)
        setImageUri(questionData[questionId].questions.fullquestion.questionImage)
    } else {
        console.log("No such document!");
    }
}

useEffect( () => {
    getFirebaseData();
},[])


return (
    <div className="col-sm">
        <h2 className="text-center ">{title}</h2>
        <div className="p-3 mb-2" style={{backgroundColor:'#ecf0f1'}}>
            <div className="text-center">
            <img alt='Question' className="mb-4 rounded img-fluid" src={imageUri} />
            </div>
            <p className='ques_sec_detail'>{questionText}</p>
        </div>
    </div>
)
}

export default QuestionSection;