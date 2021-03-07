import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, ImageBackground,Share} from 'react-native'
import Carousel from 'react-native-anchor-carousel'
import {Ionicons , Feather, MaterialIcons,Fontisto,FontAwesome } from '@expo/vector-icons'
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
    const [dataStorage, setDataStorage] = useState([])
    const [update, setUpdate] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
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
                <TouchableOpacity style={styles.carouselIcon} onPress={() => shareItem(item)}><Fontisto name="share-a" size={24} color="white" /></TouchableOpacity>
                <TouchableOpacity style={styles.carouselIconShare} onPress={() => addToFav(item)}><MaterialIcons name='library-add' size={30} color='white' /></TouchableOpacity>
            </TouchableOpacity>
            <View style={{width:Dimensions.get('window').width /2,height: Dimensions.get('window').width /3,marginTop: 16}}>
                <Text style={styles.name}>{item.original_title}</Text>
                <Text style={styles.stat1}><FontAwesome name="calendar" size={20} color="white" /> Released     {item.release_date}</Text>
                <Text style={styles.stat}><FontAwesome name="star" style={styles.statIcon} size={20} color="yellow" /> Imdb Rating              {item.vote_average}</Text>
                
            </View>
        </View>
    )
}


    const renderFavItem = ({item, index}) => {
        var item1 = JSON.parse(item[1])
        return(
            <View>
                <TouchableOpacity>
                    <Image source={{uri: `https://image.tmdb.org/t/p/w185${item1.item.poster_path}`}} style={styles.carouselImage} />
                    <TouchableOpacity style={styles.carouselIcon} onPress={() => shareItem(item)}><Fontisto name="share-a" size={24} color="white" /></TouchableOpacity>
                    <TouchableOpacity style={styles.carouselIconShare} onPress={() => removeFav(item)}><Ionicons name="ios-remove-circle" size={30} color="white" /></TouchableOpacity>
                </TouchableOpacity>
                <View style={{width:Dimensions.get('window').width /2,height: Dimensions.get('window').width /3,marginTop: 16}}>
                    <Text style={styles.name}>{item1.item.original_title}</Text>
                    <Text style={styles.stat}><FontAwesome name="calendar" size={20} color="white" /> Released     {item1.item.release_date}</Text>
                    <Text style={styles.stat}><FontAwesome name="star" style={styles.statIcon} size={20} color="yellow" /> Imdb Rating              {item1.item.vote_average}</Text>
                    
                </View>
            </View>
        )
    }
    const addToFav = async (item) => {
        // console.log(typeof(JSON.stringify(item.original_title)))
        try {
            // await AsyncStorage.setItem(`${item.original_title}`, {item})
            await AsyncStorage.setItem(JSON.stringify(item.original_title), JSON.stringify({item}))
            setUpdate(!update)
          } catch (e) {
            console.log('addToFav',e)
          }
          
    }

    

    const shareItem = async (item) => {
        try {          
            const result = await Share.share({
              message:
              `Check this awesome movie:\nhttps://image.tmdb.org/t/p/w185${item.poster_path}`
            })
          } catch (error) {
            // alert(error.message);
          }
          try {
              let data = JSON.parse(item[1])
              console.log(data,'faaaaaaaaaav')
            const result = await Share.share({
              message:
              `Check this awesome movie:\nhttps://image.tmdb.org/t/p/w185${data.item.poster_path}`
            })
          } catch (error) {
            // alert(error.message);
          }
        
        
    }

    const removeFav = async (key) => {
        console.log(key[0])
        try {
            await AsyncStorage.removeItem(key[0]);
            setUpdate(!update)
            return true;
        }
        catch(exception) {
            return false;
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

    const getAllItems = () => {
        AsyncStorage.getAllKeys()
    .then((keys)=> AsyncStorage.multiGet(keys)
                    .then((data) => {
                        // console.log(data,'data here')
                        setDataStorage(data)
                    }));
    }

    useEffect(() => {
        const data = axios.get('https://api.themoviedb.org/3/movie/popular?api_key=d684550d631cad69733c812672083206&language=en-US&page=1')
        .then(result => {
            setPopularMoviesList(result.data.results)
        })
        getAllItems()
        console.log('effect1 tekhdem', dataStorage)
        
      },[]);

      useEffect(() => {
          return () => {
            getAllItems()
            console.log(dataStorage,'run')
          }
      },[update])



    return (
        <ScrollView >
            <View style={styles.container}>
            <View style={{...StyleSheet.absoluteFillObject, backgroundColor: '#000'}}>
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
                <View style={{flex: 1,overflow: "visible", height:800}}>
                <Text style={styles.topMoviesHeader}>{movieSearch.length === 0 ? 'Top - Movies':`Results for: ${text}`}</Text> 
                <Carousel 
                data={movieSearch.length === 0 ? popularMoviesList:movieSearch }
                renderItem={renderItem}
                itemWidth={200}
                ref={carouselRef}
                containerWidth={width - 20} 
                separatorWidth={0}
                inactiveOpacity={0.4}
                // initialIndex={'0'}
                />
                </View>
                <View style={styles.carousel}>
                {dataStorage.length === 0 ? <Text style={styles.topMoviesHeader}>Add To Favourites</Text> : <Text style={styles.topMoviesHeader}>Favourites</Text>}
                
                {dataStorage.length > 0 && <Text style={styles.topMoviesHeader}>Favourites</Text>
                && <Carousel 
                data={dataStorage }
                renderItem={renderFavItem}
                itemWidth={200}
                ref={carouselRef}
                containerWidth={width - 20} 
                separatorWidth={0}
                inactiveOpacity={0.4}
                />}
                </View>
                
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
        height : Dimensions.get('window').height * 3/2.2,
        paddingHorizontal: 14,
        marginTop: 50,
        // width: '100%'
    },
    searchBox: {
        backgroundColor: '#fff',
        elevation: 10,
        borderRadius: 4,
        marginTop: 60,
        marginBottom: 20,
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
        // marginBottom: 10
    },
    background: {
        flex: 1,
        resizeMode: "cover",
        // justifyContent: "center"
    },
    carousel : {
        flex: 1,
        overflow: "visible",
        // marginTop: 250,
        // backgroundColor: "white",
    },
    carouselImage : {
        width: 200,
        height: 250,
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
    carouselIconShare : {
        position: 'absolute',
        top:15,
        left:15,
    },
    carouselIcon2: {
        position: 'absolute',
        top:10,
        right:10,
    },
    name: {
        paddingLeft: 7,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 6,
    },
    stat: {
        paddingLeft: 6,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14, 
        opacity: 0.8,
    },
    stat1: {
        paddingLeft: 6,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14, 
        opacity: 0.8,
        marginBottom: 10
    },
    statIcon: {
        marginRight:20,
        position: 'absolute',
    }
})

export default Home;