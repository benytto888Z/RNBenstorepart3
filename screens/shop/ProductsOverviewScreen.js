import React from 'react';
import { StyleSheet, Text, View,FlatList } from 'react-native';
import {useSelector} from "react-redux";
import ProductItem from "../../components/shop/ProductItem";

const ProductsOverviewScreen = props => {
    const products = useSelector(state=>state.products.availableProducts);

    return(
        <FlatList
            keyExtrator={item =>item.id}
            data={products}
            renderItem={itemData=><ProductItem product={itemData.item}
             onViewDetail={()=>{
                 props.navigation.navigate('ProductDetail',{
                     productId:itemData.item.id,
                    productTitle:itemData.item.title
                 })

             }}
             onAddToCart={()=>{}}
            />}
        />
    );
}

ProductsOverviewScreen.navigationOptions={
headerTitle : 'Tous les produits'
};

export  default  ProductsOverviewScreen;