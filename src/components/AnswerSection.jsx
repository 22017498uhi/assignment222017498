function AnswerSection() {
return (
    <div className="col-12">
        <h2 className="text-center">Answers</h2>
        <div className="p-3 mb-2" style={{backgroundColor:'#ecf0f1'}}>
            <div className="row">
                <div className="col-sm d-grid gap-2">
                    <button type="button" className="btn btn-secondary mb-2 p-4">Secondary</button>
                    <button type="button" className="btn btn-secondary mb-2 p-4">Secondary</button>
                </div>
                <div className="col-sm d-grid gap-2">
                    <button type="button" className="btn btn-secondary mb-2 p-4">Secondary</button>
                    <button type="button" className="btn btn-secondary mb-2 p-4">Secondary</button>
                </div>
            </div>
            <div className="row">
                <div className="col-sm text-center">
                    <button type="button" className="btn btn-primary mb-2 p-4">Primary</button>
                </div>
            </div>
        </div>
    </div>
)
}

export default AnswerSection;