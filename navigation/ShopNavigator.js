import React from "react";
import {Button,View,Platform,SafeAreaView} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import { createDrawerNavigator,DrawerItems  } from 'react-navigation-drawer';
import { createAppContainer,createSwitchNavigator} from 'react-navigation';
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import StartupScreen from "../screens/StartupScreen";
import {Ionicons} from "@expo/vector-icons";

import {useDispatch} from 'react-redux';
import * as AuthActions from '../store/actions/auth';


import Colors from "../constants/Colors";
import OrdersScreen from "../screens/shop/OrderScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";

import AuthScreen from '../screens/user/AuthScreen';

//--------------------------------------defaultNavOptions 

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


//------------------------------------------------ProductsStackNavigator

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


//-------------------------------------------------OrdersStackNavigator

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

//--------------------------------------------------AdminStackNavigator


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


//--------------------------------------------------ShopDrawerNavigator

const ShopDrawerNavigator=createDrawerNavigator({
Produits:ProductsStackNavigator,
Commandes:OrdersStackNavigator,
Admin:AdminStackNavigator
},{
    contentOptions:{
        activeTintColor:Colors.primary
    },
    contentComponent:props => {
        const dispatch = useDispatch();
    return <View style={{flex:1, paddingTop:20}}>
                <SafeAreaView forceInset={{top:'always',horizontal:'never'}}>
                    <DrawerItems {...props}/>
                    <Button title="Déconnexion" color={Colors.primary}
                        onPress={()=>{
                            dispatch(AuthActions.logout());//this will automatically
                            // go to the NavigationContainer and by useeffect navRef
                            // navigate towards Authscreen
                           // props.navigation.navigate('Auth');
                        }}
                    />
                </SafeAreaView>
          </View>
    }
})

//------------------------------------------------------AuthNavigator

const AuthNavigator=createStackNavigator({
Auth:AuthScreen
},{
    defaultNavigationOptions : defaultNavOptions
});

//--------------------------------------------------------MainNavigator

const MainNavigator = createSwitchNavigator({
 Startup:StartupScreen,   
 Auth:AuthNavigator,
 Shop:ShopDrawerNavigator

});

export default createAppContainer(MainNavigator);