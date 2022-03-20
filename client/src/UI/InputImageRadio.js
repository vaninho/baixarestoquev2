import React from "react";
class InputImageRadio extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }


    render() {
        return (
            <div className="requisition">
                <label>
                    <input type="radio" id={this.props.id} name={this.props.name} value={this.props.value} checked={this.props.checked} onChange={this.props.onChange} />
                    <img src={this.props.img} className="img-fluid" alt={this.props.text}/>
                    <div>{this.props.text}</div>
                </label>
            </div>
        )
    }

}

export default InputImageRadio;