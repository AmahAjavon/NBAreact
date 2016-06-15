import React, {Component,} from 'react';
import {
  AppRegistry,
  Text,
  View,
  Image,
  StyleSheet,
  ListView,
  RefreshControl,
} from 'react-native';

import TeamMap from '../Utilities/TeamMap';
import GameCell from './GameCell';

import moment from 'moment';

class ScoresPage extends React.Component {

    constructor(props){
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.state = {
            refreshing: false,
            db: [],
            dataSource: ds.cloneWithRows([]),
            loaded: false,
        }
    }

    componentWillMount(){
        this.fetchGames();
    }

    fetchGames(){
        var date = moment().format('L');
        date = date.split('/');
        var month = date[0];
        var day = date[1];
        var year = date[2];
        // date = year+month+day; //actual
        date= '20160101'; //for dev
        var url = 'http://data.nba.com/data/1h/json/cms/noseason/scoreboard/'+date+'/games.json';
        fetch(url)
        .then((response) => response.json())
        .then((jsonResponse) => {
            if(jsonResponse['sports_content']['games']['game']){
                var games = jsonResponse['sports_content']['games']['game'];
                this.setState({
                    db: games,
                    dataSource: this.state.dataSource.cloneWithRows(games),
                    loaded: true,
                });
                console.log(games);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() {
        return(
            <View style={{flex: 1}}>
                <ListView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            // onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                    style={styles.listview}
                    dataSource = {this.state.dataSource}
                    renderRow={(rowData, sectionID, rowID) =>
                        <GameCell
                            game={rowData}
                            // onPress={() => this.props.onPress(rowData)}
                        />
                    }
                />
            </View>
        )
    }
};

var styles = StyleSheet.create({
    logo: {
        width: 70,
        height: 70,
    },
    listview: {
        flex: 1,
    }
});

module.exports = ScoresPage;