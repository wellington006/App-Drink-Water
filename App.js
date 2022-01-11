import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment' // Formatar datas

import Card from './src/components/Card.js' // Dados do cabeçalho

const initialState = {
    goal: 2000,  // Meta
    waterConsumed: 0, // Consumida
    status: 'Ruim', //Status
    percentage: 0, // Porcentagem
    waterBySip: 200,  // Água por gole
    firstSipDatetime: ''
}

export default class App extends Component {
    state = { ...initialState }

    componentDidMount = async () => {
        const userDataJSON = await AsyncStorage.getItem('userData', (err, res) => {
            return res
        })
        console.log(JSON.parse(userDataJSON))
        let userData = JSON.parse(userDataJSON)
        this.setState({ ...userData })
    }

    refreshAsyncStorage = () => {
        AsyncStorage.setItem('userData', JSON.stringify(this.state))
    }

    drinkWater = () => { // beber água
        console.log(this.state)
        let { waterConsumed } = this.state // Clonando atributo

        let newWaterComsumed = waterConsumed + this.state.waterBySip
        let newPercentage = this.calculatePercentage(newWaterComsumed)
        let newStatus = this.updateStatus(newPercentage) || 'Ruim'

        newWaterComsumed >= this.state.goal ? alert('Você atingiu sua meta! Parabéns!') : null

        this.setState({
            waterConsumed: newWaterComsumed,
            status: newStatus,
            percentage: newPercentage,
            firstSipDatetime: !this.state.firstSipDatetime ? this.currentDateFormated() : this.state.firstSipDatetime
        })
    }

    calculatePercentage = (waterConsumed) => { //Calcular porcentagem
        return (waterConsumed / this.state.goal * 100).toFixed(0)  // Goal = Meta
    }

    updateStatus = (percentage) => { // Atualizando status // 0-39 = 'Ruim' // 40-79 = 'Bom' // 80-100 = Ótimo
        if (percentage >= 40 && percentage < 80) {
            return 'Bom'
        } else {
            if (percentage >= 80) {
                return 'Ótimo'
            }
        }
    }

    currentDateFormated = () => {
        return moment(new Date()).format('DD/MM/yyyy HH:mm')
    }

    reset = () => {
        this.setState({ ...initialState }, this.refreshAsyncStorage)
    }

    setGoal = (direction) => {
        let newGoal = direction === 'up' ? this.state.goal + 200 : this.state.goal - 200
        this.setState({
            goal: newGoal >= 200 ? newGoal : this.state.goal,
            percentage: this.calculatePercentage(this.state.waterConsumed)
        }, this.refreshAsyncStorage)
    }

    setWaterBySip = (direction) => {
        let newWaterBySip = direction === 'up' ? this.state.waterBySip + 20 : this.state.waterBySip - 20
        this.setState({
            waterBySip: newWaterBySip >= 20 ? newWaterBySip : this.state.waterBySip
        }, this.refreshAsyncStorage)
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('./assets/img/waterbg.png')} style={styles.backgroundImage}>
                    <View style={styles.header}>
                        <Card title='Meta' value={this.state.goal + 'ml'} onClick={e => this.setGoal()} />
                        <Card title='Consumido' value={this.state.waterConsumed + 'ml'} />
                        <Card title='Status' value={this.state.status} />
                    </View>
                    <View style={styles.body}>
                        <View style={styles.content}>
                            <View>
                                <Text style={styles.contentText}>{this.state.percentage + '%'}</Text>
                            </View>
                            <View style={styles.btnControls}>
                                <View >
                                    <TouchableOpacity style={styles.btnStyle} onPress={e => this.setWaterBySip('down')}>
                                        <Text style={styles.labelBtn}>v</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.btnStyle} onPress={this.drinkWater}>
                                        <Text style={styles.labelBtn}>{`Beber ${this.state.waterBySip}ml`}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View >
                                    <TouchableOpacity style={styles.btnStyle} onPress={e => this.setWaterBySip('up')}>
                                        <Text style={styles.labelBtn}>^</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ marginBottom: 15 }}>
                                <Text style={{color: 'white'}}>Primeiro Gole: {!this.state.firstSipDatetime ? '---' : this.state.firstSipDatetime}</Text>
                            </View>
                            <View style={styles.containerButton}>
                                <View style={styles.btnControls}>
                                    <TouchableOpacity style={styles.btnStyle} onPress={e => this.setGoal('down')}>
                                        <Text style={styles.labelBtn}>v</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.btnStyle} onPress={this.reset}>
                                        <Text style={styles.labelBtn}>Zerar dados</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.btnStyle} onPress={e => this.setGoal('up')}>
                                        <Text style={styles.labelBtn}>^</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },

    backgroundImage: {
        height: '100%',
    },

    header: {
        flex: 1,
        justifyContent: 'space-around',
        flexDirection: 'row',
        height: '35%',
        margin: 10
    },

    body: {
        height: '65%',
        alignItems: 'center',
    },

    content: {
        height: '70%',
        justifyContent: 'space-around',
    },

    contentText: {
        color: 'white',
        fontSize: 100
    },

    btnStyle: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        marginRight: 4
    },

    btnControls: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    containerButton: {
        flexDirection: 'row'
    },

    labelBtn: {
        color: '#33d6ff',
        fontSize: 22,
        textAlign: 'center'
    }

});
