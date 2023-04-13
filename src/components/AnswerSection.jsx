function AnswerSection() {
return (
    <div className="col-12">
        <h3 className="text-center">Answers</h3>
        <div className="p-3 mb-2 bg-light">
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