import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, ImageBackground} from 'react-native'
import Carousel from 'react-native-anchor-carousel'
import {fontAwesome5, Feather, MaterialIcons} from '@expo/vector-icons'
import axios from 'axios'



const {width, height} = Dimensions.get('window')




const Home = () => {
    const [popularMoviesList, setPopularMoviesList] = useState(null)
    const carouselRef = useRef(null)
    useEffect(() => {
        const data = axios.get('https://api.themoviedb.org/3/movie/popular?api_key=d684550d631cad69733c812672083206&language=en-US&page=1')
        .then(result => {
            console.log(result.data.results)
            setPopularMoviesList(result.data.results)
            console.log(popularMoviesList,'results are here')
        })
      },[]);

      const renderItem = ({item, index}) => {
          console.log(`https://image.tmdb.org/t/p/w185${item.poster_path}`)
    return(
        <View>
            <TouchableOpacity>
                <Image source={{uri: `https://image.tmdb.org/t/p/w185${item.poster_path}`}} style={styles.carouselImage} />
                <Text style={styles.carouselTitle}>{item.original_title}</Text>
                <MaterialIcons name='library-add' size={30} color='white' style={styles.carouselIcon}/>
            </TouchableOpacity>
        </View>
    )
}
    
    

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
                <Carousel style={styles.carousel}
                data={popularMoviesList}
                renderItem={renderItem}
                itemWidth={200}
                ref={carouselRef}
                containerWidth={width - 20} 
                separatorWidth={0}
                />
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
    carousel : {
        flex: 1,
        overflow: "visible"
    },
    carouselImage : {
        width: 200,
        height: 320,
        borderRadius:10,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)'
    },
    carouselTitle: {
        padding: 14,
        color: 'white',
        bottom:  10,
        position: 'absolute',
        bottom: 10,
        left: 2,
        fontWeight: 'bold'
    },
    carouselIcon: {
        position: 'absolute',
        top:15,
        right:15,
    },
})

export default Home;