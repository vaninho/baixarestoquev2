import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import axios from "axios";
import InputImageRadio from './UI/InputImageRadio';
import InputText from "./UI/InputText";
import Scanner from "./UI/Scanner";

function App() {

  const initialize = { barCodeInput: '', quantityInput: '1', productInput: '', requisitionRadio: 'bakery' }
  const [inputValue, setInputValue] = useState(initialize)
  const { barCodeInput, quantityInput, productInput, requisitionRadio } = inputValue
  const [price, setPrice] = useState('')
  const [productsAdded, setProductsAdded] = React.useState([])
  const [generateKey, setGenerateKey] = React.useState(1)

  function addProductAdded() {
    console.log(generateKey)
    setGenerateKey(generateKey + 1)
    setProductsAdded([...productsAdded, { id: generateKey, barCode: barCodeInput, product: productInput, quantity: quantityInput, requisition: requisitionRadio }])
    console.log(generateKey)
  }

  function removeProductAdded(product) {
    console.log('remove product added')
    console.log(product)
    axios.delete('delrequisition', { data: { type: product.requisition, barCode: product.barCode, quantity: product.quantity } })
      .then(response => {
        setProductsAdded(productsAdded.filter(i => i !== product))
      })
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value
    }))

  }

  function handleSubmit(event) {
    event.preventDefault()
    axios.post('/newrequisition', { type: requisitionRadio, barCode: barCodeInput, quantity: quantityInput })
      .then(response => {
        if (response.data.result) {
          alert('Produto ' + productInput + ' cadastrado com sucesso');
          addProductAdded()
          handleReset()
        } else { alert('Produto nao encontado') }
      }
      );
    handleReset(event)
  }

  function handleFakeScanClick(event) {
    changeInputByScanner('2040000053259')
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
        if (event.target.value.length <= 4) {
          setInputValue((prev) => ({
            ...prev,
            quantityInput: Math.round((price / response.data.value) * 100) / 100
          }))
        }

      } else {
        alert('Produto nao encontrado, verificar codigo de barras');
      }
    });
  }


  //LAYOUT 3
  const changeInputByScanner = (p) => {
    let value = p;
    if (p.startsWith('2')) {
      value = parseInt(p.substring(1, 5)) + ''
      setPrice(parseInt(p.substring(6, 10)) + '.' + p.substring(10, 12))
    }
    setInputValue((prev) => ({
      ...prev,
      barCodeInput: value
    }))
    document.getElementById('barCodeInput').focus()

  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <Scanner output={changeInputByScanner} />
          {/* <button type="button" onClick={handleFakeScanClick} className="btn btn-outline-secondary">Fake Scan</button> */}
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



      {productsAdded && productsAdded.length > 0 && <table className='table' >
        <thead className='table-light'>
          <tr>
            <th scope='col'>Produto</th>
            <th scope='col'>Código</th>
            <th scope='col'>Qtde</th>
            <th scope='col'>Tipo</th>
            <th scope='col'>Remover</th>
          </tr>
        </thead>
        <tbody>
          {productsAdded.map(productAdded => (
            <tr key={productAdded.id}>
              <th scope='row'>{productAdded.product}</th>
              <td>{productAdded.barCode}</td>
              <td>{productAdded.quantity}</td>
              <td>{productAdded.requisition === 'bakery' ? 'Padaria' : (productAdded.requisition === 'cleaning' ? 'Limpeza' : 'Quebra')}</td>
              <td><button onClick={() => removeProductAdded(productAdded)}>X</button></td>
            </tr>
          ))}
        </tbody>

      </table>}
    </div>
  );
}

export default App;
