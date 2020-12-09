import React from 'react';
//Plot = require('../node_modules/react-plotly.js/react-plotly.js')
//import Plotly from 'react-plotly.js';
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

const buttonStyle = {
    padding: "10px 10px 10px 10px",
    borderRadius: "12px",
    margin: "10px 10px 10px 10px"
};

class Stock extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            stockXValues: [],
            stockYValues: [],
            stockColor: 'red',
            ticker: ""
        }
    }

    componentDidUpdate(prevProps){ 
        
        if(this.props.symbol !== prevProps.symbol){
            console.log("props:" + this.props.symbol);
            console.log("prevProps:" + prevProps.symbol);
            this.fetchStock();
        } 
    }

    componentDidMount(){
        this.setState({ ticker: this.props.symbol});
        this.fetchStock();
    }

    fetchStock(){
        let pointerThis = this;
        //let symbol = this.state.ticker;
        let symbol = this.props.symbol;
        let API_data = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=compact&apikey=KAGW9DUN9OURP821`;

        let xValues = [];
        let yValues = [];

        fetch(API_data)
            .then(
                function(response){
                    return response.json();
                }
            )
            .then(
                function(data){

                    for(var key in data['Time Series (Daily)']){
                        xValues.push(key);
                        yValues.push(data["Time Series (Daily)"][key]['1. open']);
                
                    }
                    //console.log(xValues);
                    pointerThis.setState({
                        stockXValues: xValues,
                        stockYValues: yValues
                    });
                }
            )
    }

    buttonStyle(){

    }

    onClickHandler(evt){
        let pointerThis = this;
        if(evt.target.value == "red"){
            pointerThis.setState({
                stockColor: 'red'
            }); 
        }
        else if(evt.target.value == "blue"){
            pointerThis.setState({
                stockColor: 'blue'
            }); 
        }
        else if(evt.target.value == "green"){
            pointerThis.setState({
                stockColor: 'green'
            });
        }
    }

    render(){

        return(
            <div>
                <p>Clique em um dos botões abaixo para mudar a cor do gráfico.</p>
                <div>
                    <button onClick={this.onClickHandler.bind(this)} style={buttonStyle} value="red">Vermelho</button>
                    <button onClick={this.onClickHandler.bind(this)} style={buttonStyle} value="green">Verde</button>
                    <button onClick={this.onClickHandler.bind(this)} style={buttonStyle} value="blue">Azul</button>
                </div>
                <Plot
                    data={[
                        {
                            x: this.state.stockXValues,
                            y: this.state.stockYValues,
                            type: 'scatter',
                            mode: 'lines+markers',
                            marker: {color: this.state.stockColor},
                        }
                        
                    ]}
                    layout={{width: 720, height: 440, title: 'Gráfico das ações'}}
                    
                />
            </div>
        );
    }

}

export default Stock; 