import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, ImageBackground} from 'react-native'
import Carousel from 'react-native-anchor-carousel'
import {fontAwesome5, Feather, MaterialIcons} from '@expo/vector-icons'
import axios from 'axios'



const {width, height} = Dimensions.get('window')

// const renderItem = ({item, index}) => {
//     return(
//         <View>
//             <TouchableOpacity>
//                 <Image source={{uri: item.name}}
//             </TouchableOpacity>
//         </View>
//     )
// }


const Home = () => {
    const [moviesList, setMoviesList] = useState(null)
    const carouselRef = useRef(null)
    const data = axios.get('https://api.themoviedb.org/3/movie/550?api_key=d684550d631cad69733c812672083206')
    .then(result => {
        console.log(result.results)
        // setMoviesList(result)
        // console.log(moviesList)
    })
    

    return (
        <ScrollView>
            <View style={styles.container}>
            <View style={{...StyleSheet.absoluteFill, backgroundColor: '#000'}}>
                <ImageBackground 
                style={styles.background}
                source={require('../../assets/bg.jpg')}
                blurRadius={2}
                >
                <View style={styles.searchBox}>
                    <TextInput 
                    placeholder="Search For Movies..."
                    placeholderTextColor='#666'
                    style={styles.search}
                    />
                    <Feather name='search' color='#666' size={22} style={styles.searchBoxIcon} />
                </View>
                <Text style={styles.topMoviesHeader}>Top - Movies</Text>
                {/* <Carousel style={styles.carousel}
                data={}
                renderItem={renderItem}
                itemWidth={200}
                /> */}
                </ImageBackground>
            </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor : '#000',
        height : Dimensions.get('window').height,
        paddingHorizontal: 14,
        marginTop: 50
    },
    searchBox: {
        backgroundColor: '#fff',
        elevation: 10,
        borderRadius: 4,
        marginVertical: 80,
        width: (Dimensions.get('window').width) *6/7,
        flexDirection: 'row',
        alignSelf: 'center'
    },
    search: {
        padding: 13,
        paddingLeft: 18,
        fontSize: 16
    },
    searchBoxIcon: {
        position: 'absolute',
        right: 20,
        top: 16,
    },
    topMoviesHeader: {
        color: 'white',
        fontSize: 24,
        fontWeight: '700',
        marginLeft: 30,
        marginVertical: -40
    },
    background: {
        flex: 1,
        resizeMode: "cover",
        // justifyContent: "center"
    },
})

export default Home;