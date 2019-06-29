import { GETPRODUCTS } from '../types';

const initialState = {
    data: [],
    loading: true
};

export default (state = initialState, action) => {
    switch(action.type) {
    case GETPRODUCTS:
        return { data: action.payload, loading: true };
    default:
        return state;
    }
};
