import { connect } from 'react-redux';
import initialize from '../utils/initialize';
import Layout from '../components/Layout';

const Index = () => (
  <Layout title="NailedOM - Home">
    <h2 className="title is-2">Nailed Opinion Mining</h2>
    <img src="/static/nextjs.jpg" />
    <p>
      An Opinion Mining application developed by Next.js.
    </p>
  </Layout>
);

Index.getInitialProps = function(ctx) {
  initialize(ctx);
};

export default connect(state => state)(Index);
