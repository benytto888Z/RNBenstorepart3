import PRODUCTS from "../../data/dummy-data";

const initialState = {
    // availableProducts : all products and also only the products which we didn't
    // create so that we can't buy our own product
    availableProducts:PRODUCTS,
    userProducts:PRODUCTS.filter(prod => prod.ownerId === 'u1')  // list of products we create with ownerId
};

export default (state = initialState,action)=>{
    return state;
};
