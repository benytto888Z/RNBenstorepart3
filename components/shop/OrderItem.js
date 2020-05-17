import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import CartItem from "./CartItem";
import Colors from "../../constants/Colors";
import Card from "../UI/Card";

const OrderItem = props => {
    const [showDetatils, setShowDetails] = useState(false);
    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.totalAmount}>{props.amount.toFixed(2)}€</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            <Button
                color={Colors.primary}
                title={showDetatils ? "Masquer le Détail" :"Voir le Détail"}
                onPress={() => setShowDetails(prevState => !prevState)}
            />
            {showDetatils && <View style={styles.detailsItems}>
                {props.items.map(cartitem =>
                    <CartItem
                        key={cartitem.productId}
                        quantity={cartitem.quantity}
                        amount={cartitem.sum}
                        title={cartitem.productTitle}
                    />
                )}
            </View>}
        </Card>
    )
}

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center',
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date: {
        fontSize: 16,
        fontFamily: 'open-sans',
        color: '#888'
    },
    detailsItems:{
        width:'100%'
    }
})

export default OrderItem;







