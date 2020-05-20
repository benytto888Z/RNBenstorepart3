import React, { useState} from 'react';
import { View, Text, Button, StyleSheet, FlatList,ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import CartItem from '../../components/shop/CartItem.js';
import * as CartActions from "../../store/actions/cart";
import * as OrdersActions from "../../store/actions/orders.js";
import OrdersScreen from "./OrderScreen";
import Card from "../../components/UI/Card";


const CartScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const dispatch = useDispatch();
    const cartItems = useSelector(state => {
        const transformedCardItems = [];
        for (const key in state.cart.items) {
            transformedCardItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            })
        }
        return transformedCardItems.sort((a, b) => a.productId > b.productId ?
            1 : -1
        );
    });


    const sendOrderHandler = async () => {
        setIsLoading(true);
        await dispatch(OrdersActions.addOrder(cartItems, cartTotalAmount));
        setIsLoading(false);
    }

    return <View style={styles.screen}>
        <Card style={styles.summary}>
            <Text style={styles.summaryText}>Total:{' '}
                <Text style={styles.amount}>{Math.round(cartTotalAmount.toFixed(2) * 100) / 100}€</Text>
                {/* ou faire <Text style={styles.amount}>{+cartTotalAmount.toFixed(2)}€</Text>*/}
            </Text>

            {isLoading ? <ActivityIndicator size="small" color = {Colors.primary}/> : (
            <Button color={Colors.accent} title="Acheter maintenat" disabled={cartItems.length === 0}
                onPress={sendOrderHandler}
            />
            )}

        </Card>
        <FlatList
            data={cartItems}
            keyExtractor={item => item.productId}
            renderItem={itemData => (
                <CartItem
                    quantity={itemData.item.quantity}
                    title={itemData.item.productTitle}
                    amount={itemData.item.sum}
                    onRemove={() => dispatch(CartActions.removeFromCart(itemData.item.productId))}
                    deletable
                />)
            }
        />
    </View>
}

CartScreen.navigationOptions = {
    headerTitle: 'Ton Panier'
}

const styles = StyleSheet.create({
    screen: {
        margin: 20,

    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.accent
    }
})

export default CartScreen;