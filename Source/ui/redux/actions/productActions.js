import Axios from 'axios';
import { GETPRODUCTS } from '../types';
import { API } from '../../config';

const getProducts = () => {
    return (dispatch) => {
        Axios
        .get(`${API}/products/getAll`)
        .then((response) => {
            dispatch({type: GETPRODUCTS, payload: response.data});
        })
        .catch((err) => {
            throw new Error(err);
        });
    };
};

export default {
    getProducts
};
