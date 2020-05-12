import React from 'react';
import {Text, View, Button, Image, TouchableOpacity, Platform, StyleSheet, TouchableNativeFeedback} from 'react-native';
import Colors from "../../constants/Colors";
import {TouchableWithoutFeedback} from "react-native-web";

const ProductItem = props =>{
    let TouchableCmp = TouchableOpacity;
    if(Platform.OS ==='android' && Platform.Version >= 21){
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <View style={styles.product}>
            <View style={styles.touchable}>
                <TouchableCmp onPress={props.onViewDetail} useForeground>
                    <View>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={{uri:props.product.imageUrl}}/>
                        </View>

                        <View style={styles.details}>
                            <Text  style={styles.title}>{props.product.title}</Text>
                            <Text style={styles.price}>{props.product.price.toFixed(2)}€</Text>
                        </View>

                        <View style={styles.actions}>
                            <Button color={Colors.primary} title="Détails" onPress={props.onViewDetail}></Button>
                            <Button color={Colors.primary} title="+Panier" onPress={props.onAddToCart}></Button>
                        </View>
                    </View>

                </TouchableCmp>
            </View>

</View>
    )
};

const styles = StyleSheet.create({
    product:{
        shadowColor:'black',
        shadowOpacity: 0.26,
        shadowOffset:{width:0,height:2},
        shadowRadius:8,
        elevation:5,
        borderRadius:10,
        backgroundColor:'white',
        height:300,
        margin:20,

    },
    touchable:{
        borderRadius:10,
        overflow: 'hidden'
    },
    imageContainer:{
        width: '100%',
        height:'60%',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        overflow:'hidden'
    },
    image:{
        width: '100%',
        height:'100%'
    },
    details:{
      alignItems: 'center',
      height:'15%',
      padding:10
    },
    title:{
        fontFamily:'open-sans-bold',
        fontSize:16,
        marginVertical:2
    },
    price:{
        fontFamily:'open-sans',
        fontSize:14,
        color:'#888'
    },
    actions:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        height:'25%',
        paddingHorizontal:20
    }
})

export default ProductItem;