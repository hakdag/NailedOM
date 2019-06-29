import React from 'react';
import { connect } from 'react-redux';
import initialize from '../../utils/initialize';
import Layout from '../../components/Admin-Layout';
import ReactTable from 'react-table';
import actions from '../../redux/actions';
import Axios from 'axios';
import { API } from '../../config';

class Products extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: props.products,
      loading: false
    };
  }

  static async getInitialProps(ctx) {
    initialize(ctx);
    const res = await Axios.get(`${API}/products/getAll`);
    return { products: res.data };
  }

  render() {
    return (
      <Layout title="Products">
        { (
          <ReactTable
            data={this.props.products}
            columns={[{
              Header: 'Name',
              accessor: 'ProductName'
            }, {
              Header: 'Description',
              accessor: 'Description'
            }, {
              Header: 'Rating',
              accessor: 'CurrentRating',
              Cell: props => <span className='number'>{props.value}</span>
            }]}
            manual
          />
        )} 
      </Layout>
    );
  }
}

export default connect(
  state => state,
  actions
)(Products);
