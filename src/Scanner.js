import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import React from "react";

class Scanner extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            isOpened: false,

        }
        this.html5Qrcode = new Html5Qrcode('reader')
        this.handleOpenBarCodeScanner = this.handleOpenBarCodeScanner.bind(this)
        this.handleCloseBarCodeScanner = this.handleCloseBarCodeScanner.bind(this)
    }

    handleCloseBarCodeScanner() {
        this.setState({ isOpened: false })
        this.html5Qrcode.clear()
        this.html5Qrcode.close()
    }   


    handleOpenBarCodeScanner() {

        this.setState({ isOpened: true });

        let qrCodeSucessCallback = (decodedText, decodedResult) => {
            //TODO give the value to APP
            console.log('success '+decodedText)
            console.log(decodedResult)
            this.handleCloseBarCodeScanner();
        }

        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                const cameraId = devices[0].id;
                console.log(cameraId)
                //TODO change the 
                this.html5Qrcode.start(cameraId, { fps: 30, qrbox: {width: 300, height: 120}, format: Html5QrcodeSupportedFormats.EAN_13 },
                    qrCodeSucessCallback, (errorMessage) => { })
            }
        }).catch(error => { console.log(error) })
    }

    render() {
        return (
            <>
                <button type="button" onClick={this.handleCloseBarCodeScanner} style={{display: this.state.isOpened ? 'inline' : 'none'}}>Cancelar</button>
                <button type="button" onClick={this.handleOpenBarCodeScanner}>Ler código de barras</button>
            </>
        )
    }


}
export default Scanner;