import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, ImageBackground, Pressable} from 'react-native'
import Carousel from 'react-native-anchor-carousel'
import {fontAwesome5, Feather, MaterialIcons} from '@expo/vector-icons'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';



const {width, height} = Dimensions.get('window')




const Home = () => {
    const [background, setBackground] = useState(
        require('../../assets/bg.jpg')
    )
    const [popularMoviesList, setPopularMoviesList] = useState(null)
    const [movieSearch, setMovieSearch] = useState('')
    const [text, setText] = useState('');
    const [dataStorage, setDataStorage] = useState(null)
    const carouselRef = useRef(null)
    

      


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
                <TouchableOpacity style={styles.carouselIcon} onPress={() => addToFav(item)}><MaterialIcons name='library-add' size={30} color='white' /></TouchableOpacity>
            </TouchableOpacity>
            {movieSearch.length !== 0 && <View style={{width:Dimensions.get('window').width - 14, justifyContent: 'space-between',marginTop: 16}}>
                <Text style={styles.name}>{item.original_title}</Text>
                <Text style={styles.stat}>{item.release_date}</Text>
                <Text style={styles.stat}>{item.vote_average}</Text>
                
            </View>}
        </View>
    )
}
    const addToFav = async (item) => {
        // console.log(typeof(JSON.stringify(item.original_title)))
        try {
            // await AsyncStorage.setItem(`${item.original_title}`, {item})
            await AsyncStorage.setItem(JSON.stringify(item.original_title), JSON.stringify({item}))
          } catch (e) {
            console.log(e)
          }
          
    }
    const handleSearch = text => {
        
        setText(text)
        // console.log(text)
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

    useEffect(() => {
        const data = axios.get('https://api.themoviedb.org/3/movie/popular?api_key=d684550d631cad69733c812672083206&language=en-US&page=1')
        .then(result => {
            setPopularMoviesList(result.data.results)
        })

        // const fetchAllItems = async () => {
        //     try {
        //         const keys = await AsyncStorage.getAllKeys()
        //         const items = await AsyncStorage.multiGet(keys)
        //         console.log(items,'iteeeeeeeeeeeeeeeeeeems')
        //         return items
        //     } catch (error) {
        //         console.log(error, "problemo")
        //     }
        // }
        // fetchAllItems()
        AsyncStorage.getAllKeys()
    .then((keys)=> AsyncStorage.multiGet(keys)
                    .then((data) => console.log(data,'data here')));
      },[]);

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
                
                <Text style={styles.topMoviesHeader}>{movieSearch.length === 0 ? 'Top - Movies':`Results for: ${text}`}</Text> 
                <Carousel style={styles.carousel}
                data={movieSearch.length === 0 ? popularMoviesList:movieSearch }
                renderItem={renderItem}
                itemWidth={200}
                ref={carouselRef}
                containerWidth={width - 20} 
                separatorWidth={0}
                inactiveOpacity={0.4}
                />
                <Text style={styles.carouselTitle}>Favourites</Text>
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
    name: {
        paddingLeft: 14,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
        marginBottom: 6,
    },
    stat: {
        paddingLeft: 14,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14, 
        opacity: 0.8
    },
})

export default Home;