import Vue from 'vue'
import Vuex from 'vuex'
import utils from '../../src/utils/utils.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: false,
  state: {
    coinTableHeader: [
      { text: "Coins", sortable:false, align: 'left', value: name, weight: '25px' },
      { text: 'Price US$', value: 'priceUSD'},
      { text: 'Price A$', value: 'priceAUD'},
      { text: 'Market Cap US$', value: 'marketCapUsd'},
      { text: 'Volume US$', value: 'volumaUsd24h'},
      { text: 'Circulating Supply', value: 'totalSupply'},
      { text: 'Change (24h)', value: 'dayPercVar'},
      { text: 'Change (7d)', value: 'weekPercVar'}
    ],
    currentCoin: {},
    selectedPair: {name: 'Australian Dollar', symbol: 'AUD'},
    selectedCoin: {name: 'Bitcoin', symbol: 'BTC'},
    currentCurrency: 'AUD',
    topCoins: [],
    coinTableitems: [],
    allCoinsTableItems: [],
    marketCoinItems:[],
    coinMarkets:[],
    totalCoins: 0,
    user: {id: '',  email: '' }

  },
  getters:{
    marketCoinItems: state => {
      return state.marketCoinItems
    },
    user: state => {
      return state.user
    },
    selectedPair: state => {
      return state.selectedPair
    },
    selectedCoin: state => {
      return state.selectedCoin
    },
    currentCurrency: state =>{
      return state.currentCurrency
    },
    currentCoin: state =>{
      return state.currentCoin
    },
    coinTableHeader: state =>{
      return state.coinTableHeader
    },
    coinTableItems: state =>{
      return state.coinTableitems
    },
    allCoinsTableItems: state =>{
      return state.allCoinsTableItems
    },
    currentCoin: state => {
      return state.currentCoin
    },
    topCoins: state => {
      return state.topCoins
    },
    coinMarkets: state => {
      return state.coinMarkets
    },
    totalCoins: state =>{
      //let ttlCoins = state.allCoinsTableItems.length
      return 1560
    },
   },
  mutations:{
    setUser: (state, payload) => {
      state.user = payload
    },
    setMarketCoinItems: (state, payload) => {
      state.marketCoinItems = payload
    },
    setSelectedPair: (state, payload) => {
      state.selectedPair = payload
      store.dispatch('fetchCoinMarkets', 'MARKET')//TODO
    },
    setSelectedCoin: (state, payload) => {
      state.selectedCoin = payload
      store.dispatch('fetchCoinMarkets', 'MARKET')
    },
    setCurrentCurrency: (state, payload) => {
      state.currentCurrency = payload
    },
    setCurrentCoin: (state, payload) => {
      state.currentCoin = payload
    },
    activateCoin: (state, payload) =>{
        //deactivate all elements
        state.topCoins.forEach(element => {
          element.isActive = false;
        });
        //activate clicked coin
        payload.isActive = true;
        //set the currentCoin to bind it to child component
        state.currentCoin = payload;
    },
    fetchTopCoins: (state, payload) => {
        let requestData = [];
        let coinsCryptoCompare = []
        let coins = []
        let coin = {}
        let currency = 'AUD';
        let limitCoins = '10'
        let baseImageUrl = ''
        let url = `https://api.coinmarketcap.com/v1/ticker/?convert=${currency}&limit=${limitCoins}`
        let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        let urlCoinList = `${proxyUrl}https://www.cryptocompare.com/api/data/coinlist/`
        
        
        //this.$http.get(url)
        fetch(url)
        .then(response => response.json())
        .then(function(data){ 
          requestData = data;
          requestData.forEach( function (item){
            
            coin = {};
            coin.value = false
            coin.isActive = item.rank === "1";
            coin.name = item.name;
            coin.id = ''
            coin.symbol = '';
            coin.priceAud = utils.formatNumbersCents(item.price_aud)
            coin.priceUsd = utils.formatNumbersCents(item.price_usd)
            coin.weekPercVar = item.percent_change_7d;
            coin.dayPercVar = item.percent_change_24h;
            coin.hourPercVar = item.percent_change_1h;
            coin.marketCapAud = utils.formatNumbers(item.market_cap_aud)
            coin.marketCapUsd = utils.formatNumbers(item.market_cap_usd)
            coin.totalSupply = utils.USFormat(item.total_supply);
            coin.volumeUsd = utils.formatNumbers(item['24h_volume_usd'])
            coin.imageUrl = ''

            coins.push(coin);
          })
          return coins
        })
        //To get the coins images
        .then(coins => {
          fetch(urlCoinList)
          .then(response => response.json())
          .then(data => {
            coins.map(coin => {
              coin.imageUrl = data.BaseImageUrl
            })
            Object.keys(data.Data).forEach(function(key) {
              coins.map(coin => {
                //if (data.Data[key].CoinName.toLowerCase() === coin.name.toLowerCase())
                if(data.Data[key].Symbol.toLowerCase() === coin.symbol.toLowerCase() || data.Data[key].CoinName.toLowerCase() === coin.name.toLowerCase()) {
                  coin.imageUrl = coin.imageUrl + data.Data[key].ImageUrl
                  coin.id = data.Data[key].Id
                  coin.symbol = data.Data[key].Symbol
                }
              })
            });
          })
          state.coinTableitems = coins
          return coins
        })
    },
    fetchAllCoins: (state, payload) => {
      let requestData = [];
      let coinsCryptoCompare = []
      let coins = []
      let coin = {}
      let currency = 'AUD';
      let baseImageUrl = ''
      let url = `https://api.coinmarketcap.com/v1/ticker/?convert=${currency}&limit=2000`//TODO
      let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
      let urlCoinList = `${proxyUrl}https://www.cryptocompare.com/api/data/coinlist/`
      
      
      //this.$http.get(url)
      fetch(url)
      .then(response => response.json())
      .then(function(data){ 
        requestData = data;
        requestData.forEach( function (item){
          
          coin = {};
          coin.value = false
          coin.isActive = item.rank === "1";
          coin.id = ''
          coin.name = item.name;
          coin.symbol = item.symbol;
          coin.priceAud = utils.formatNumbersCents(item.price_aud)
          coin.priceUsd = utils.formatNumbersCents(item.price_usd)
          coin.weekPercVar = item.percent_change_7d;
          coin.dayPercVar = item.percent_change_24h;
          coin.hourPercVar = item.percent_change_1h;
          coin.marketCapAud = utils.formatNumbersCents(item.market_cap_aud)
          coin.marketCapUsd = utils.formatNumbers(item.market_cap_usd)
          coin.totalSupply = utils.USFormat(item.total_supply);
          coin.volumeUsd = utils.formatNumbers(item['24h_volume_usd'])
          coin.imageUrl = ''
          coin.exchanges = []
          coin.coinInfo = {}

          coins.push(coin);
        })
        return coins
      })
      //To get the coins images
      .then(coins => {
        fetch(urlCoinList)
        .then(response => response.json())
        .then(data => {
          coins.map(coin => {
            coin.imageUrl = data.BaseImageUrl
          })
          Object.keys(data.Data).forEach(function(key) {
            coins.map(coin => {
              if (data.Data[key].Symbol.toLowerCase() === coin.symbol.toLowerCase() || data.Data[key].CoinName.toLowerCase() === coin.name.toLowerCase()){
                coin.imageUrl = coin.imageUrl + data.Data[key].ImageUrl
                coin.id = data.Data[key].Id
                coin.symbol = data.Data[key].Symbol
              }
            })
          });
          return coins
        })
        .then(coins => {

           if(payload === 'MARKET') {//Just for Coins that need Market infos */
            let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
            let url = ""
            let symbol = ""

            Object.keys(coins).forEach( (key) => {
              symbol = coins[key].symbol.toUpperCase()
              
              if (state.selectedCoin.symbol.toUpperCase() === coins[key].symbol.toUpperCase()
                  || state.selectedCoin.symbol.toUpperCase() === coins[key].name.toUpperCase()){
              //url = `${proxyUrl}https://min-api.cryptocompare.com/data/top/exchanges/full?fsym=${symbol}&tsym=${state.currentCurrency}`
                url = `${proxyUrl}https://min-api.cryptocompare.com/data/top/exchanges/full?fsym=${state.selectedCoin.symbol}&tsym=${state.selectedPair.symbol}`
                fetch(url)
                .then(response => response.json())
                .then(data => {
                    if(data.Message === "No exchanges available"){
                      coins[key].exchanges = []
                    }else{
                      /* console.log(data.Data)
                      console.log(data.Data.Exchanges) */
                      data.Data.AggregatedData.PRICE = utils.formatNumbersCents(data.Data.AggregatedData.PRICE)
                      data.Data.AggregatedData.LASTVOLUME = utils.USFormat3(data.Data.AggregatedData.LASTVOLUME)
                      data.Data.AggregatedData.VOLUMEDAY = utils.USFormat3(data.Data.AggregatedData.VOLUMEDAY)
                      data.Data.AggregatedData.OPENDAY = utils.formatNumbersCents(data.Data.AggregatedData.OPENDAY)
                      data.Data.AggregatedData.HIGHDAY = utils.formatNumbersCents(data.Data.AggregatedData.HIGHDAY)
                      data.Data.AggregatedData.LOWDAY = utils.formatNumbersCents(data.Data.AggregatedData.LOWDAY)
                      data.Data.AggregatedData.CHANGEPCTDAY >= 0 ? data.Data.AggregatedData.POSITIVE = true : data.Data.AggregatedData.POSITIVE = false
                      data.Data.AggregatedData.CHANGEPCTDAY = utils.USFormat2(data.Data.AggregatedData.CHANGEPCTDAY) + '%'
                      
                      coins[key].coinInfo = data.Data.AggregatedData
                      data.Data.Exchanges.map( (exchange) => {
                        exchange.PRICE = utils.formatNumbersCents(exchange.PRICE)
                        exchange.LASTVOLUME = utils.USFormat3(exchange.LASTVOLUME)
                        exchange.VOLUME24HOUR = utils.USFormat3(exchange.VOLUME24HOUR)
                        exchange.OPEN24HOUR = utils.formatNumbersCents(exchange.OPEN24HOUR)
                        exchange.HIGH24HOUR = utils.formatNumbersCents(exchange.HIGH24HOUR)
                        exchange.LOW24HOUR = utils.formatNumbersCents(exchange.LOW24HOUR)
                        exchange.CHANGEPCT24HOUR >= 0 ? exchange.POSITIVE = true : exchange.POSITIVE = false
                        exchange.CHANGEPCT24HOUR = utils.USFormat2(exchange.CHANGEPCT24HOUR) + '%'
                      })
                      coins[key].exchanges = data.Data.Exchanges
                    } 
                })
              } 
            })
            state.marketCoinItems = coins
          }   
          return coins          
        })
        state.marketCoinItems = coins
        state.allCoinsTableItems = coins
        return coins        
      })
    }    
  },
  actions: {
    UPDATE_USER: (context, payload) => {
      context.commit('setUser', payload)
    },
    UPDATE_PAIR: (context, payload) => {
      context.commit('setSelectedPair', payload)
    },
    UPDATE_COIN: (context, payload) => {
      context.commit('setSelectedCoin', payload)
    },
    fetchTopCoins: (context, payload) => {
      context.commit('fetchTopCoins')
    },
    fetchAllCoins: (context, payload) => {
      context.commit('fetchAllCoins')
    },
    fetchCoinMarkets: (context, payload) => {
      context.commit('fetchAllCoins', payload)
    },
    setCurrentCurrency: (context, payload) => {
      context.commit('setCurrentCurrency', payload)
    },
    setCurrentCoin: (context, payload) => {
      context.commit('setCurrentCoin', payload)
    }
  }  

})