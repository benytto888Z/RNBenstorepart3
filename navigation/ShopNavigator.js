import React from "react";
import {Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import {Ionicons} from "@expo/vector-icons";


import Colors from "../constants/Colors";
import OrdersScreen from "../screens/shop/OrderScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";

const defaultNavOptions = {
        headerStyle:{
            backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
        },
        headerTitleStyle:{
            fontFamily:'open-sans-bold',
        },
        headerBackTitleStyle:{
            fontFamily:'open-sans',
        },
        headerTintColor:Platform.OS === 'android' ? 'white' : Colors.primary
    }


const ProductsStackNavigator=createStackNavigator({
ProductsOverview:ProductsOverviewScreen,
ProductDetail:ProductDetailScreen,
Cart:CartScreen,

},{
    navigationOptions:{
        drawerIcon:drawerConfig => <Ionicons
            name={Platform.OS === 'android'? 'md-cart' : 'ios-cart'}
            size={23}
            color = {drawerConfig.tintColor}
        />
    },
    defaultNavigationOptions: defaultNavOptions
})

const OrdersStackNavigator = createStackNavigator({
    Orders:OrdersScreen
},{
    navigationOptions:{
        drawerIcon:drawerConfig => <Ionicons
        name={Platform.OS === 'android'? 'md-list' : 'ios-list'}
        size={23}
        color = {drawerConfig.tintColor}
        />
    },
    defaultNavigationOptions: defaultNavOptions
})


const AdminStackNavigator = createStackNavigator({
    UserProducts:UserProductsScreen,
    EditProduct:EditProductScreen
},{
    navigationOptions:{
        drawerIcon:drawerConfig => <Ionicons
            name={Platform.OS === 'android'? 'md-create' : 'ios-create'}
            size={23}
            color = {drawerConfig.tintColor}
        />
    },
    defaultNavigationOptions: defaultNavOptions
})

const ShopDrawerNavigator=createDrawerNavigator({
Produits:ProductsStackNavigator,
Commandes:OrdersStackNavigator,
Admin:AdminStackNavigator
},{
    contentOptions:{
        activeTintColor:Colors.primary
    }
})

export default createAppContainer(ShopDrawerNavigator);