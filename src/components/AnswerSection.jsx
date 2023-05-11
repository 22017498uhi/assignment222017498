
import React, { useEffect, useState } from 'react';
import { firestore } from "../services/firebase";
import { doc, getDoc, setDoc} from "firebase/firestore";
import { MathJax } from "better-react-mathjax";
import { Chart as ChartJS, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement);

function AnswerSection() {

    const [questionId] = useState('balances'); // should be done through URL and routing with useParams()
    const [answerData, setAnswerData] = useState([]) //answerdata from firestore stored here
    const [totalUserReponsesCount, setTotalUserResponsesCount] = useState(0); //stores total response count of each answer, used for answer popularity feature
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1); // stores the index of answer selected by the user
    const [answerResult, setAnswerResult] = useState(""); //stores outcome of answer attempt i.e correct or incorrect
    const [showAnswerPopularity, setShowAnswerPopularity] = useState(false); // flag controls visibiliy of answer popularity chart

    //function called inside useEffect
    const getFirebaseData = async () => {

        const questionsRef = doc(firestore, "Questions", questionId);
        const questionsDocSnap = await getDoc(questionsRef);

        if (questionsDocSnap.exists()) {

            const questionData = questionsDocSnap.data()
            let answerLocalData = questionData[questionId].questions.fullquestion.answer;

            //get total responses
           const totalUserResponsesCount = answerLocalData.reduce((a, currentObj) =>
              currentObj.userResponsesCount + a,0
            )

            setTotalUserResponsesCount(totalUserResponsesCount);
            setAnswerData(questionData[questionId].questions.fullquestion.answer)
  
        } else {
            console.log("No such document!");
        }
    }

    useEffect(() => {
        getFirebaseData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const validateAnswer = () => {
        //first update the user response count
        setTotalUserResponsesCount(totalUserReponsesCount + 1);
        answerData[selectedAnswerIndex].userResponsesCount = (answerData[selectedAnswerIndex].userResponsesCount + 1) || 1;
        var questObj = {
            [questionId]: {
                questions: {
                    fullquestion: {
                        answer: answerData
                    }
                }
            }
        };

        //setDoc - add if not there.. if already there ignore, if any change, update existing record.
        setDoc(doc(firestore, "Questions",
            questionId), (questObj), { merge: true })

        //now check if selected answer is correct
        const correctAns = answerData.find((ele, index) => {
            return (index === selectedAnswerIndex) && (ele.correct === true)
        })

        if (correctAns) {
            setAnswerResult('correct');
        } else {
            setAnswerResult('incorrect');
        }
    }

    return (
        <div className="col-12">
            <h2 className="text-center">Answers</h2>
            <div className="p-3 mb-2" style={{ backgroundColor: '#ecf0f1' }}>
                <div className="row">
                    {answerData && answerData.map((ansObj, index) => (
                        <div key={index} className="col-6">
                            <button type="button" className={`btn btn-secondary mb-2 p-4 iwse-ans-btn ${selectedAnswerIndex === index ? 'iwse-selected-ans' : ''}`} style={{ width: '100%' }}
                                onClick={() => { setSelectedAnswerIndex(index); setAnswerResult("") }}>
                                <span className='d-flex justify-between align-items-center'>
                                    <span className='flex-fill'><MathJax>{ansObj.text}</MathJax></span>
                                    {showAnswerPopularity && <span style={{width:'80px'}}><Doughnut id={index} options={{cutout:25}} data={{
                                        datasets: [
                                            {
                                                data: [parseInt(((ansObj?.userResponsesCount || 0) * 100) / totalUserReponsesCount), (100 - (parseInt(((ansObj?.userResponsesCount || 0) * 100) / totalUserReponsesCount)))],
                                                backgroundColor: ["#0d6efd", "#F1F2EE"],
                                                borderWidth: 1,
                                            },
                                        ],
                                    }} /> <span style={{
                                        position: "absolute",
                                        marginTop: "-50px",
                                        marginLeft: "-13px",
                                        fontSize:"16px"
                                      }}>{parseInt(((ansObj?.userResponsesCount || 0) * 100) / totalUserReponsesCount)}%</span> </span> }
                                </span>
                            </button>
                        </div>
                    ))}


                </div>
                <div className="row">
                    <div className="col-sm text-center">
                        {!answerResult && <div><button type="button" className="btn btn-primary mb-2 p-4" onClick={validateAnswer} disabled={selectedAnswerIndex < 0}>CHECK MY ANSWER</button> 
                        <button className='btn btn-link ms-2' onClick={() => {setShowAnswerPopularity(true)}}>Check Answer popularity</button> </div>}
                        {answerResult && <button className={`btn btn-primary mb-2 p-4 ${answerResult === 'correct' ? 'btn-success' : 'btn-danger'}`}>{answerResult === 'correct' ? 'CORRECT' : 'WRONG, TRY AGAIN!'}</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnswerSection;