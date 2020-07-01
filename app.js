const key="FXAIXDL0C7LFKS6W";
const btn_busca= document.getElementById('btn-busca');
const delbtn=document.getElementById("resp-busca");
const btn_tblsalva=document.getElementById("resp-salva");//
btn_busca.addEventListener('click',busca);
const acaoSalva=[];
 
 //UI da tabela busca
 delbtn.addEventListener("click",function(e){
    if(e.target.classList.contains("fa-trash-alt")){   
        del(e);
    }else if(e.target.classList.contains("fa-save")){
        let x=e.target.parentElement.parentElement;
        if(acaoSalva.indexOf(x.children[0].textContent)==-1){
            acaoSalva.push(x.children[0].textContent);          //salva o simbolo da acao no array
            x=x.innerHTML.replace(`<i id="save" class="far fa-save"></i>`,""); //remove o icone de salvar
            document.getElementById("resp-salva").insertAdjacentHTML("afterbegin",x); 
        }
        else{
            alert("Acao ja salva");
        }
    }
    else if(e.target.classList.contains("fa-chart-line")){      
        graficoAcao(e);
    }
 });

 
//UI TA TABELA SALVA
 btn_tblsalva.addEventListener("click",function(e){
     if(e.target.classList.contains("fa-trash-alt")){ 
       del(e);
    }else if(e.target.classList.contains("fa-chart-line")){
        graficoAcao(e);
}
});

//BUTAO BUSCA
function busca(e){
    let texto=document.getElementById("busca-texto").value;
    const apiB=`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${texto}&apikey=${key}`;
    getJsonBusca(apiB);
    texto=document.getElementById("busca-texto").value='';
};

//funcao popular grafico de busca 
function getJsonBusca(api){
    fetch(api)
    .then(res=>{  
        return res.json();
    })
    .then(data=>{
        let output="";
        data.bestMatches.forEach(function(element) {
            output+=`<tr>
                    <td>${element["1. symbol"]}</td>
                     <td>${element["2. name"]}</td>
                     <td>${element["3. type"]}</td>
                     <td>${element["4. region"]}</td>
                     <td>${element["5. marketOpen"]}</td>
                     <td>${element["6. marketClose"]}</td>
                     <td>${element["7. timezone"]}</td>
                     <td>${element["8. currency"]}</td>
                     <td><i id='grafo'class="fas fa-chart-line"></i><i id="save" class="far fa-save"></i><i id=delete class="far fa-trash-alt"></i></td>
                     </tr>`;
         });      
       document.getElementById("resp-busca").innerHTML=output;  
    })
};




//funcao de deletar
function del(e){
    let graficodele=document.getElementById("graficodiv");
        if(document.getElementById("graficodiv")!=null && e.target.parentElement.parentElement.nextElementSibling==document.getElementById("graficodiv")){//se tiver grafico deletar grafico  
            e.target.parentElement.parentElement.nextElementSibling.remove(); 
       }
       if(e.target.parentElement.parentElement.parentElement.contains(document.getElementById("resp-busca"))){
        e.target.parentElement.parentElement.remove();
    }else{
        let pos=acaoSalva.indexOf(e.target.parentElement.parentElement.children[0].textContent);
        acaoSalva.splice(pos, 1);
        e.target.parentElement.parentElement.remove();
       }
}

//funcao grafico
function graficoAcao(e){
    let graficodele=document.getElementById("graficodiv");
    simb=e.target.parentElement.parentElement.children[0].textContent;//simbolo para chamar a api
    apiD=`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${simb}&apikey=${key}`;
    //se o proximo elemento for o grafico deleta ele
    if(document.getElementById("myDiv")!=null ){
        graficodele.remove();    
    }  
    e.target.parentElement.parentElement.insertAdjacentHTML('afterend',`<tr id="graficodiv"><td colspan="9"><div id="myDiv" style="width:1200px;height:700px;"></div></canvas></td></tr>`);
    fetch(apiD)
    .then(res=>{  
        return res.json();  
    })
    .then(data=>{
        let datas=[];
        let openD=[];
        let highD=[];
        let lowD=[];
        let closeD=[];
        for (let element in data["Time Series (Daily)"]) {
            datas.push(element);
            openD.push(data["Time Series (Daily)"][element]["1. open"]);
            highD.push(data["Time Series (Daily)"][element]["2. high"]);
            lowD.push(data["Time Series (Daily)"][element]["3. low"]);
            closeD.push(data["Time Series (Daily)"][element]["4. close"]);       
         };      
         plotGraf(datas,openD,highD,lowD,closeD)
        }) 
      
    }
    function plotGraf(datas,open,high,low,close){
     
        var trace = {
            x: datas,
            close: close,
            high: high,
            low: low,
            open: open,
          
            // cutomise colors
            increasing: {line: {color: 'Limão'}},
            decreasing: {line: {color: 'red'}},
          
            type: 'candlestick',
            xaxis: 'x',
            yaxis: 'y'
          };
          
          var data = [trace];
          
          var layout = {
            dragmode: 'zoom',
            showlegend: false,
            xaxis: {
                autorange: true,
                title: 'Date',
                 rangeselector: {
                    x: 0,
                    y: 1.2,
                    xanchor: 'left',
                    font: {size:8},
                    buttons: [{
                        step: 'month',
                        stepmode: 'backward',
                        count: 1,
                        label: '1 month'
                    }, {
                        step: 'month',
                        stepmode: 'backward',
                        count: 3,
                        label: '3 months'
                    }, {
                        step: 'all',
                        label: 'All dates'
                    }]
                  }
              },
              yaxis: {
                autorange: true,
              }
            };
            var config = {responsive: true}
          Plotly.newPlot('myDiv', data, layout,config);
          
    
        }




        
    