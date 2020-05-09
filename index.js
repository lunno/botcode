const axios = require(`axios`);

async function pegarTemp(cidade) {

  
  const temperaturaAPI = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=recife&appid=8ceb48353bf895add769572636422ae8`)
  const temperaturaC = temperaturaAPI.data.main.temp-273
    
  console.log(temperaturaC.toFixed(0))
};

pegarTemp('recife')
