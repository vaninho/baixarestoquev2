import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import React from "react";

class Scanner extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isOpened: false,

        }
        this.output = props.output;
        this.html5Qrcode = new Html5Qrcode('reader')
        this.handleOpenBarCodeScanner = this.handleOpenBarCodeScanner.bind(this)
        this.handleCloseBarCodeScanner = this.handleCloseBarCodeScanner.bind(this)
    }

    handleCloseBarCodeScanner() {
        this.setState({ isOpened: false })
        this.html5Qrcode.stop().then((ignore) => {
        }).catch((err) => {
        });
    }


    handleOpenBarCodeScanner() {

        this.setState({ isOpened: true });

        let qrCodeSucessCallback = (decodedText, decodedResult) => {
            this.handleCloseBarCodeScanner();
            this.output(decodedText)
        }

        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                const cameraId = devices[1].id;
                console.log(cameraId)
                //TODO change the 
                this.html5Qrcode.start(cameraId, { fps: 10, qrbox: { width: 200, height: 100 }, format: Html5QrcodeSupportedFormats.EAN_13 },
                    qrCodeSucessCallback, (errorMessage) => { })
                document.getElementById('reader').scrollIntoView({ block: 'center' })
            }
        }).catch(error => { console.log(error) })
    }

    render() {
        return (
            <>
                <div className="full-screen" style={{ display: this.state.isOpened ? 'block' : 'none' }}>
                    <div className="middle">
                        <button type="button" onClick={this.handleCloseBarCodeScanner} style={{ display: this.state.isOpened ? 'block' : 'none' }} className="btn btn-primary">Cancelar</button>
                    </div>
                </div>
                <button type="button" onClick={this.handleOpenBarCodeScanner} className="btn btn-outline-secondary" style={{ margin: '5px' }}>Ler código de barras</button>

            </>
        )
    }


}
export default Scanner;
