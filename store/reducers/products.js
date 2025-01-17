//import PRODUCTS from "../../data/dummy-data";
import {CREATE_PRODUCT, DELETE_PRODUCT, SET_PRODUCTS, UPDATE_PRODUCT} from "../actions/products";
import Product from "../../models/Product";

const initialState = {
    // availableProducts : all products and also only the products which we didn't
    // create so that we can't buy our own product
    availableProducts:[],
    userProducts:[]  // list of products we create with ownerId
};

export default (state = initialState,action)=>{
    switch(action.type){
        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts
            };
        case CREATE_PRODUCT:
            const newProduct = new Product(
                action.productData.id,
                action.productData.ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price,
            );

        return{
            ...state,
            availableProducts: [...state.availableProducts,newProduct],
            userProducts: [...state.userProducts,newProduct]
        };

        case UPDATE_PRODUCT:
            const productIndex = state.userProducts.findIndex(prod =>
                prod.id === action.pid);
            const updatedProduct = new Product(
                action.pid,
                state.userProducts[productIndex].ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                state.userProducts[productIndex].price
                );
        const updatedUserProducts =[...state.userProducts];

        updatedUserProducts[productIndex] = updatedProduct;

        // find also if exist id of the updating product in availableProduct
        const availableProductIndex = state.availableProducts.findIndex(prod => prod.id === action.pid)
        const updatedAvailableProducts = [...state.availableProducts];
        updatedAvailableProducts[availableProductIndex] = updatedProduct;
        return {
            ...state,
            availableProducts: updatedAvailableProducts,
            userProducts: updatedUserProducts
        }



        case DELETE_PRODUCT:
            return{
                ...state,
                userProducts: state.userProducts.filter(
                    prod=>prod.id !== action.pid
                ),
                availableProducts: state.availableProducts.filter(
                    prod=>prod.id !== action.pid
                )
            }

    }
    return state;
};
