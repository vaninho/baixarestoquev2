import React from "react";
import Scanner from "./Scanner";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [productInput, setProductInput] = React.useState('')
  const [barCodeInput, setBarCodeInput] = React.useState('')

  function handleSubmit(event) {
    event.preventDefault()
    console.log(`Cod: ${barCodeInput} - Produto: ${productInput} - Quantidade: ${event.target.elements.quantityInput.value}`)
    handleReset(event)
  }

  function handleFakeScanClick(event) {
    console.log(event)
    console.log('fake')
    document.getElementById('barCodeInput').value = 123
  }

  function handleReset(event) {
    setProductInput('')
    setBarCodeInput('')
    event.target.elements.quantityInput.value = ''
  }

  function handleBarCodeInputBlur(event) {
    if (event.target.value === '123') {
      setProductInput('Test')
    } else {
      setProductInput('')
    }
  }
  function handleBarCodeInputChange(event) {
    setBarCodeInput(event.target.value)
  }

  //TODO Refatorar inputs
  function InputText(id, value) {
    return (<div>
      <div>
        <label htmlFor="barCodeInput" className="form-label">
          Código de barras:
        </label>
        <input type="text" id={id} onBlur={handleBarCodeInputBlur} onChange={handleBarCodeInputChange} value={value} className='form-control' />
      </div>
    </div>)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Scanner output={setBarCodeInput} />
        <button type="button" onClick={handleFakeScanClick}>Fake Scan</button>
      </div>
      <InputText id='barCodeInput' value={barCodeInput} />
      <div>
        <label htmlFor="productInput">
          Produto:
        </label>
        <input type="text" id="productInput" readOnly={true} value={productInput} />
      </div>
      <div>
        <label htmlFor="quantityInput">
          Quantidade:
        </label>
        <input type="text" id="quantityInput" />
      </div>
      <button type="submit" className="btn btn-primary">Cadastrar</button>
      <button type="reset" className="btn btn-outline-secondary" onClick={handleReset}>Limpar</button>
    </form>
  );
}

export default App;
