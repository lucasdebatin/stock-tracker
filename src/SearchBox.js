import React from 'react';
import Stock from './Stock';
import './SearchBox.css';

//Inserir a key da Alpha Vantage API
const key = "demo";
var tickerList = [];

class SearchBox extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            ticker: "",
            stock: "",
            tickerListState: []
        };
    }

    componentDidMount(){ }

    fetchTicker(){
        let PointerThis = this;
        let keyword = PointerThis.state.ticker;
        let API_data = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${key}`;
        let symbols = [];

        fetch(API_data)
            .then(
                function(response){
                    return response.json();
                }
            )
            .then(
                function(data){

                    for(var key in data['bestMatches']){
                        symbols.push(data["bestMatches"][key]['1. symbol']);
                    }

                    if(symbols.length > 0){

                        for(var i in tickerList){
                            if(tickerList[i] == symbols[0]){
                                alert("Esse ticker ja foi adicionado");
                                return;
                            }
                        }

                        tickerList.push(symbols[0]);
                        alert("Ticker " + symbols[0] + " foi adicionado na lista de ações");
                        PointerThis.setState({
                            tickerListState: tickerList
                        });
                        PointerThis.renderButton();
                    }
                    else{
                        alert("Ticker não encontrado. Tente novamente");
                    }

                }
            )
    }

    renderButton(){
        const buttonStyle = {
            backgroundColor: "deepskyblue",
            padding: "15px 15px 15px 15px",
            borderRadius: "12px",
            margin: "10px 10px 10px 10px"
        };
        return this.state.tickerListState.map((tickerElement) => (
            <button key={tickerElement} 
                onClick={this.onClickButtonHandler.bind(this)}
                onDoubleClick={this.onDoubleClickHandler.bind(this)} 
                value={tickerElement}
                style={buttonStyle}>{tickerElement}</button>)
        )
    }

    onClickButtonHandler = (event) => {
        let symbol = event.target.value;
        if(symbol != null){
            this.setState({ stock: symbol});
            console.log("symbol: " + this.state.stock);
        }
    }

    onDoubleClickHandler = (event) => {
        let symbol = event.target.value;
        for(let i in tickerList){
            if(tickerList[i] == symbol){
                tickerList.splice(i,1);
                this.setState({
                    tickerListState: tickerList,
                    stock:""
                });
            }
        }
    }

/*    renderStock(symbol){
        
        if(symbol != null){
            //this.setState({ stock: symbol});
            return(
                <Stock></Stock>
            );
        }
    } */

    onSubmitHandler = (event) => {
        event.preventDefault();
        this.fetchTicker();
    }

    onChangeHandler = (event) => { this.setState({ticker: event.target.value}); }

    render(){

        return(
            <div>
                <h1>Tracker de Ações</h1>
                <div>
                    <form onSubmit={this.onSubmitHandler}>
                        <p>Digite o ticker da ação:</p>
                        <input type="text" onChange={this.onChangeHandler}></input>
                        <input type="submit" value="Pesquisar"></input>
                    </form>
                </div>

                <div>
                    <p>Clique uma vez para visualizar o gráfico.</p>
                    <p>Clique duas vezes para remover ação da lista.</p>
                    <h4>Lista de ações:</h4>
                    <div>{this.renderButton()}</div>
                    <div>{this.state.stock !== "" ? <Stock symbol={this.state.stock} />:null}</div>
                </div>
            </div>
        );
    }
}

export default SearchBox;