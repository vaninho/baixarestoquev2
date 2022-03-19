import React from "react";

class InputText extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }


    render() {
        return (
            <div>
                <label htmlFor="props.id" className="form-label" >
                    {this.props.label}
                </label>
                < input type="text" className='form-control' id={this.props.id} value={this.props.value} name={this.props.name} onChange={this.props.onChange} onBlur={this.props.onBlur} />
            </div>
        )

    }


}
export default InputText;