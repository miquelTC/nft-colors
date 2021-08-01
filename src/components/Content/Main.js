import { useState } from 'react';

const Main = (props) => {
  const [enteredColor, setEnteredColor] = useState('');
  const [colorIsValid, setColorIsValid] = useState(true);

  const enteredColorHandler = (event) => {
    setEnteredColor(event.target.value);
  };

  const submissionHandler = (event) => {
    event.preventDefault();

    const isValid = /^#[0-9A-F]{6}$/i.test(enteredColor);
    setColorIsValid(isValid);
    
    if(isValid) {      
      props.contract.methods.safeMint(enteredColor).send({from: props.account})
      .on('transactionHash', (hash) => {
        props.setIsLoading(true);
        props.setColors(prevState => [...prevState, enteredColor]);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        props.setIsLoading(false);
      });
    } 
  };

  const inputClass = colorIsValid? "form-control mb-1" : "form-control is-invalid mb-1";
  
  return(
    <div className="container-fluid mt-2">
      <div className="row">
        <main role="main" className="col-lg-12 d-flex justify-content-center text-center">
          <div className="content mr-auto ml-auto">
            <h1>NFT Open Colors</h1>
            <form onSubmit={submissionHandler}>
              <input
                type='text'
                className={inputClass}
                placeholder='e.g. #FFFFFF'
                value={enteredColor}
                onChange={enteredColorHandler}
              />
              {!colorIsValid ? <p className="text-danger"> Please, enter a valid hex color</p> : null}
              <div className="d-grid">
                <button type='submit' className='btn btn-primary btn-block'>MINT</button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <hr/>
      <div className="row text-center">
        { props.colors.map((color, key) => {
          return(
            <div key={key} className="col-md-3 mb-3">
              <div className="token" style={{ backgroundColor: color }}></div>
              <div>{color}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Main;