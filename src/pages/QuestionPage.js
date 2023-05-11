import QuestionSection from "../components/QuestionSection";
import HintsSection from "../components/HintsSection";
import AnswerSection from "../components/AnswerSection";


function QuestionPage() {
    return (   
    <div className="container-fluid" style={{width:'98%'}}>
        
        <div className="row">
            <QuestionSection />
            <HintsSection />
        </div>
        <div className="row">
            <AnswerSection />
        </div>
    </div>   
    )
}

export default QuestionPage;