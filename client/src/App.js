import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import axios from "axios";
import InputImageRadio from './UI/InputImageRadio';
import InputText from "./UI/InputText";
import Scanner from "./UI/Scanner";

function App() {

  const initialize = { barCodeInput: '', quantityInput: '1', productInput: '', requisitionRadio: 'bakery' }
  const [inputValue, setInputValue] = React.useState(initialize)
  const { barCodeInput, quantityInput, productInput, requisitionRadio } = inputValue;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value
    }))

  }

  function handleSubmit(event) {
    event.preventDefault()
    console.log(`Cod: ${barCodeInput} - Produto: ${productInput} - Quantidade: ${quantityInput} - Requisicao: ${requisitionRadio}`)
    axios.post('/newrequisition', { type: requisitionRadio, barCode: barCodeInput, quantity: quantityInput })
        .then(response => {
          if (response.data.result) {
            alert('Produto ' + productInput + ' cadastrado com sucesso');
            handleReset()
          } else { alert('Produto nao encontado') }
        }
        );
    handleReset(event)
  }

  function handleFakeScanClick(event) {
    changeInputByScanner('7896468830166')
  }

  function handleReset(event) {
    setInputValue(initialize)
  }

  function handleBarCodeInputBlur(event) {
    if (event.target.value === '') { return }
    axios.get('/product/' + event.target.value).then(response => {
      if (response.data.found) {
        setInputValue((prev) => ({
          ...prev,
          productInput: response.data.desc
        }))
      } else {
        alert('Produto nao encontrado, verificar codigo de barras');
      }
    });
  }

  const changeInputByScanner = (p) => {
    setInputValue((prev) => ({
      ...prev,
      barCodeInput: p
    }))
    document.getElementById('barCodeInput').focus()

  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Scanner output={changeInputByScanner} />
        <button type="button" onClick={handleFakeScanClick} className="btn btn-outline-secondary">Fake Scan</button>
      </div>
      <InputText label='Código de barras:' id='barCodeInput' name='barCodeInput' value={barCodeInput} onChange={handleInputChange} onBlur={handleBarCodeInputBlur} />
      <div>
        <label htmlFor="productInput" className="form-label">
          Produto:
        </label>
        <input type="text" id="productInput" readOnly={true} value={productInput} className='form-control' />
      </div>
      <InputText label='Quantidade:' id='quantityInput' name='quantityInput' value={quantityInput} onChange={handleInputChange} />
      Tipo de requisição:
      <div className='type-requisition'>
        <InputImageRadio id='bakeryRadio' name='requisitionRadio' value='bakery' img='padaria.png' text='Produção Padaria' checked={requisitionRadio === 'bakery'} onChange={handleInputChange} />
        <InputImageRadio id='reductRadio' name='requisitionRadio' value='break' img='quebra.png' text='Quebra' checked={requisitionRadio === 'break'} onChange={handleInputChange} />
        <InputImageRadio id='cleaningRadio' name='requisitionRadio' value='cleaning' img='limpeza.png' text='Limpeza' checked={requisitionRadio === 'cleaning'} onChange={handleInputChange} />
      </div>
      <button type="submit" className="btn btn-primary" style={{ margin: '5px' }}>Cadastrar</button>
      <button type="reset" className="btn btn-outline-secondary" onClick={handleReset} style={{ margin: '5px' }}>Limpar</button>
    </form>
  );
}

export default App;