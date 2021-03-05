import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, ImageBackground} from 'react-native'
import Carousel from 'react-native-anchor-carousel'
import {fontAwesome5, Feather, MaterialIcons} from '@expo/vector-icons'
import axios from 'axios'



const {width, height} = Dimensions.get('window')




const Home = () => {
    const [background, setBackground] = useState(
        require('../../assets/bg.jpg')
    )
    const [popularMoviesList, setPopularMoviesList] = useState(null)
    const [movieSearch, setMovieSearch] = useState('')
    const [text, setText] = useState('');
    const [showSearch, setShowSearch] = useState(false)
    const carouselRef = useRef(null)
    useEffect(() => {
        const data = axios.get('https://api.themoviedb.org/3/movie/popular?api_key=d684550d631cad69733c812672083206&language=en-US&page=1')
        .then(result => {
            setPopularMoviesList(result.data.results)
        })
      },[]);
      const renderItem = ({item, index}) => {
    return(
        <View>
            <TouchableOpacity onPress={() => {
                carouselRef.current.scrollToIndex(index)
                setBackground({
                    uri: `https://image.tmdb.org/t/p/w185${item.poster_path}`
                })
            }}>
                <Image source={{uri: `https://image.tmdb.org/t/p/w185${item.poster_path}`}} style={styles.carouselImage} />
                <Text style={styles.carouselTitle}>{item.original_title}</Text>
                <MaterialIcons name='library-add' size={30} color='white' style={styles.carouselIcon}/>
            </TouchableOpacity>
        </View>
    )
}
    
    const handleSearch = text => {
        
        setText(text)
        console.log(text)
        axios.get(`https://api.themoviedb.org/3/search/movie?query=${text}&api_key=d684550d631cad69733c812672083206`)
        .then(result => {
            // console.log(result.data.results,'resuuuuuuuuuuuults')
            setMovieSearch(result.data.results)
        })
        .catch(err => console.log(err))
        // setShowSearch(true)
        if(text.length === 0) {
            setMovieSearch('')
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
            <View style={{...StyleSheet.absoluteFill, backgroundColor: '#000'}}>
                <ImageBackground 
                style={styles.background}
                source={background}
                blurRadius={2}
                >
                <View style={styles.searchBox}>
                    <TextInput 
                    placeholder="Search For Movies..."
                    placeholderTextColor='#666'
                    style={styles.search}
                    defaultValue={text}
                    onChangeText={handleSearch}
                    />
                    <Feather name='search' color='#666' size={22} style={styles.searchBoxIcon} />
                </View>
                
                <Text style={styles.topMoviesHeader}>Top - Movies</Text> 
                <Carousel style={styles.carousel}
                data={movieSearch.length === 0 ? popularMoviesList:movieSearch }
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
        bottom:  0,
        position: 'absolute',
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