import Link from 'next/link';
import Head from 'next/head';
import { connect } from 'react-redux';
import actions from '../redux/actions';

const Layout = ({ children, title, isAuthenticated, deauthenticate }) => (
  <div>
    <Head>
      <title>Admin - { title }</title>
      <meta charSet="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="description" content="Nailed Opinion Mining Admin interface." />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      <meta name="mobile-web-app-capable" content="yes" />
      <link rel="icon" sizes="192x192" href="/static/android-desktop.png" />

      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="Material Design Lite" />
      <link rel="apple-touch-icon-precomposed" href="/static/ios-desktop.png" />

      <link rel="shortcut icon" href="/static/favicon.png" />

      <link href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <link rel="stylesheet" href="/static/material.min.css" />
      <link rel="stylesheet" href="/static/styles.css" />
      <link rel="stylesheet" href="/static/admin.css" />
      <link rel="stylesheet" href="https://unpkg.com/react-table@latest/react-table.css" />
    </Head>

    <div className="mdl-layout__container">
      <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
        <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">{ title }</span>
            <div className="mdl-layout-spacer"></div>
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
              <Link href="/"><a>Home</a></Link>
              {isAuthenticated && <li onClick={deauthenticate}><a>Sign Out</a></li>}
              <Link href="/whoami"><a>Who Am I</a></Link>
            </ul>
          </div>
        </header>
        <div className="demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">
          <header className="demo-drawer-header">
            <img src="/static/user.jpg" className="demo-avatar" />
            <div className="demo-avatar-dropdown">
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <div className="mdl-layout-spacer"></div>
            </div>
          </header>
          <nav className="demo-navigation mdl-navigation mdl-color--blue-grey-800">
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">home</i>Dashboard</a>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">people</i>Users</a>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">shopping_cart</i>Products</a>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">forum</i>Comments</a>
          </nav>
        </div>
        <main className="mdl-layout__content mdl-color--grey-100">
          { children }
        </main>
      </div>
    </div>
    <script src="/static/material.min.js"></script>
  </div>
);

const mapStateToProps = (state) => (
  {isAuthenticated: !!state.authentication.token}
);

export default connect(mapStateToProps, actions)(Layout);
