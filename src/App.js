import React from "react";
import Scanner from "./Scanner";

function App() {

  const [productInput, setProductInput] = React.useState('')

  function handleSubmit(event) {
    event.preventDefault()
    console.log(`Cod: ${event.target.elements.barCodeInput.value} - Produto: ${productInput} - Quantidade: ${event.target.elements.quantityInput.value}`)
    handleReset(event)
  }

  function handleFakeScanClick() {

  }

  function handleReset(event) {
    setProductInput('')
    event.target.elements.barCodeInput.value = ''
    event.target.elements.quantityInput.value = ''
  }

  function handleBarCodeInput(event) {
    if (event.target.value === '123') {
      setProductInput('Teste')
    } else {
      setProductInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Scanner />
        <button type="button" onClick={handleFakeScanClick}>Fake Scan</button>
      </div>
      <div>
        <label htmlFor="barCodeInput">
          Código de barras:
        </label>
        <input type="text" id="barCodeInput" onBlur={handleBarCodeInput} />
      </div>
      <div>
        <label htmlFor="productInput">
          Produto:
        </label>
        <input type="text" id="productInput" disabled={true} value={productInput} />
      </div>
      <div>
        <label htmlFor="quantityInput">
          Quantidade:
        </label>
        <input type="text" id="quantityInput" />
      </div>
      <button type="submit">Cadastrar</button>
      <button type="reset" onClick={handleReset}>Limpar</button>
    </form>
  );
}

export default App;
