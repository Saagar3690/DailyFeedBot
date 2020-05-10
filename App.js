import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

import { API_KEY } from './utils/WeatherAPIKey';

//import { wordList } from 'random-words';

import Weather from './components/Weather';
import Header from './components/Header';

import Colors from './constants/colors';
import { article } from './constants/article';

export default class App extends React.Component {
  state = {
    isLoading: true,
    temperature: 0,
    weatherCondition: null,
    quote: 'One small step for man, one giant leap for mankind',
    quoteAuthor:'Neil Armstrong',
    compli: '',
    articleTitle: article.title,
    articleDescription: article.description,
    articlePublished: article.date,
    articleSource: article.source,
    origin: '',
    dest: '',
    dist: '',
    commuteTime: '',
    goalsFor: 0,
    goalsAgainst: 0,
    draws: 0,
    losses: 0,
    wins: 0,
    matchesPlayed: 0,
    error: null
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        this.setState({
          error: 'Error Getting Weather Condtions'
        });
      }
    );

    this.fetchQuote();
    this.fetchCompliment();
    this.fetchNews();
    this.fetchCommute();
    //this.fetchNewWord();
    this.fetchSoccerStats();
  }

  fetchSoccerStats() {
    fetch("https://api-football-v1.p.rapidapi.com/v2/statistics/87/529", {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": '0a9fb365demshef27b386b4cd8aap1ce12bjsneb7fe51701c2'
      }
    })
    .then(response => response.json())
    .then(info => {
      this.setState({
        goalsFor: info.api.statistics.goals.goalsFor.total,
        goalsAgainst: info.api.statistics.goals.goalsAgainst.total,
        draws: info.api.statistics.matchs.draws.total,
        losses: info.api.statistics.matchs.loses.total,
        wins: info.api.statistics.matchs.wins.total,
        matchesPlayed: info.api.statistics.matchs.matchsPlayed.total
      });
    })
  }

  /*fetchNewWord() {
    var randNum = Math.floor(Math.random()*wordList.length);
    console.log(wordList[randNum]);
    fetch("https://wordsapiv1.p.mashape.com/words/example", {
      method: 'GET',
      headers: {
        "X-Mashape-Key": "fc205d2b78mshabddb9f816ce361p196d08jsnb4a3ca79bd4e"
      }
    })
    .then(response => response.json())
    .then(info => {
      console.log(info);
    })
  }*/

  fetchCommute() {
    fetch("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Cupertino&destinations=Los+Angeles&key=AIzaSyAoManj0clTWFcoMoetCEYxyW-GvN6Q9WQ")
    .then(response => response.json())
    .then(info => {
      this.setState({
        origin: info.origin_addresses[0],
        dest: info.destination_addresses[0],
        dist: info.rows[0].elements[0].distance.text,
        commuteTime: info.rows[0].elements[0].duration.text
      });
    })
  }

  fetchNews() {
    fetch("https://newsapi.org/v2/top-headlines?country=us&apiKey=e2e4f83af67141a1a14784e093e25a3a")
    .then(response => response.json())
    .then(articlesCont => {
      this.setState({
        articleTitle: articlesCont.articles[0].title,
        articleDescription: articlesCont.articles[0].description,
        articlePublished: articlesCont.articles[0].publishedAt,
        articleSource: articlesCont.articles[0].source.name
      });
    })
  }

  fetchCompliment() {
    fetch("https://complimentr.com/api")
    .then(complimentr => complimentr.json())
    .then(compliments => {
      this.setState({
        compli: compliments.compliment
      });
    })
  }

  fetchQuote() {
    fetch("https://api.quotable.io/random")
    .then(response => response.json())
    .then(quotes => {
      this.setState({
        quote: quotes.content,
        quoteAuthor: quotes.author
      });
    })
  }

  fetchWeather(lat, lon) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=imperial`
    )
      .then(res => res.json())
      .then(json => {
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          isLoading: false
        });
      });
  }

  render() {
    const { isLoading, weatherCondition, temperature } = this.state;
    return (
      <View style={styles.container}>
        <Header title="Daily Feed"/>
        <View style={styles.complimentContainer}>
          <Text style={styles.complimentText}>WELCOME! {this.state.compli} :)</Text>
        </View>
        <View style={styles.titleContainer}><Text style={styles.title}>Daily Quote</Text></View>
        <View style={styles.quoteContainer}>
          <Text style={{textAlign: 'center', fontStyle: 'italic'}}>{this.state.quote}</Text>
          <Text>~{this.state.quoteAuthor}</Text>
        </View>
        <View style={styles.titleContainer}><Text style={styles.title}>Weather</Text></View>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Fetching The Weather</Text>
          </View>
        ) : (
          <Weather weather={weatherCondition} temperature={temperature} />
        )}
        <View style={styles.titleContainer}><Text style={styles.title}>News</Text></View>
        <View style={styles.newsContainer}>
          <Text style={{fontWeight: 'bold', fontSize: '14', textAlign: 'center'}}>{this.state.articleTitle}</Text>
          <View style={styles.articleInfo}>
            <Text>{this.state.articlePublished}</Text>
            <Text>   -   </Text>
            <Text>{this.state.articleSource}</Text>
          </View>
          <Text style={{textAlign: 'center'}}>{this.state.articleDescription}</Text>
        </View>
        <View style={styles.titleContainer}><Text style={styles.title}>Commute</Text></View>
        <View style={styles.commuteContainer}>
          <View style={{flexDirection:'row'}}><Text style={{textAlign:'center'}}>From </Text><Text style={{fontWeight: 'bold'}}>{this.state.origin}</Text><Text> to </Text><Text style={{fontWeight: 'bold'}}>{this.state.dest}</Text><Text>:</Text></View>
          <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}><Text style={{textAlign:'center'}}>Estimated distance: </Text><Text style={{fontWeight:'bold'}}>{this.state.dist}</Text></View>
          <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}><Text style={{textAlign:'center'}}>Estimated commute: </Text><Text style={{fontWeight:'bold'}}>{this.state.commuteTime}</Text></View>
        </View>
        <View style={styles.titleContainer}><Text style={styles.title}>Soccer Stats</Text></View>
        <View style={styles.soccerContainer}>
          <Text style={{fontWeight: 'bold', fontSize: '16'}}>Barcelona</Text>
          <Text>Matches Played: {this.state.matchesPlayed}   Wins: {this.state.wins}   Losses: {this.state.losses}   Draws: {this.state.draws}</Text>
          <Text>Goals For: {this.state.goalsFor}   Goals Against: {this.state.goalsAgainst}</Text>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDE4'
  },
  loadingText: {
    fontSize: 30
  },
  quoteContainer: {
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  complimentContainer: {
    backgroundColor: '#71c7ec',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  complimentText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  newsContainer: {
    backgroundColor: Colors.accent,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  commuteContainer: {
    backgroundColor: Colors.accent,
    padding: 10
  },
  soccerContainer: {
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center'
  },
  articleInfo: {
    flexDirection: 'row',
  },
  titleContainer: {
    backgroundColor: '#189ad3',
    padding: 2
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18
  }
});
