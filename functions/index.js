  const functions = require('firebase-functions');
  const axios = require(`axios`);
  const {WebhookClient} = require('dialogflow-fulfillment');
  const {Card, Suggestion} = require('dialogflow-fulfillment');
  
  async function previsao(cidade) {  
    temperaturaAPI = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=8ceb48353bf895add769572636422ae8`)
    temperaturaC = temperaturaAPI.data.main.temp-273
    return temperaturaC.toFixed(0)
  }

  async function versiculos(versiculo){
    bibliaAPI = await axios.get(`https://bibleapi.co/api/verses/nvi/random`)
    livro = bibliaAPI.data.book.name
    capitulo = bibliaAPI.data.chapter
    numero = bibliaAPI.data.number
    verso = bibliaAPI.data.text
    versoTodo = `Olha coisinha vou te mandar um Versículo da bíblia, fica ${livro}, capitulo ${capitulo}, número ${numero}, "${verso}" `;
    return versoTodo;
  }

  exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
     
    async function temperaturaBot(agent) {
      const cidade = agent.parameters.lugar.city
      const pegarTemp = await previsao(cidade);
      let condicao = "Temperatura normal.";
      
      if(pegarTemp > 30) {
        condicao = "Ta é quente hein bixinho!";
      }else if(condicao  < 20){
        condicao = "huuh, meus códigos estão tremendo de frio."
      }
      agent.add(`Pelos meus códigos, a temperatura atual em ${cidade} é de ${pegarTemp} Graus! ${condicao}`)
    } 

    async function versiculoBot(agent){
      const bibliaAPI = await axios.get(`https://bibleapi.co/api/verses/nvi/random`)
      const livro = bibliaAPI.data.book.name
      const capitulo = bibliaAPI.data.chapter
      const numero = bibliaAPI.data.number
      const verso = bibliaAPI.data.text
      agent.add(`Aqui vai, fica em.. \n\n${livro}, capitulo ${capitulo}, versículo ${numero}.\n\n ${verso} `);
    }
  
    let intentMap = new Map();
    intentMap.set('mandarVersiculo', versiculoBot);
    intentMap.set('previsaoTempo', temperaturaBot);
    agent.handleRequest(intentMap);
  });
