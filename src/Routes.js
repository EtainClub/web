import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import asyncComponent from 'asyncComponent';
import { Icon } from 'antd';
import { getMeBegin } from 'features/User/actions/getMe';
import { selectMe } from 'features/User/selectors';
import Header from 'features/App/Header';
import Post from 'features/Post/Post';
import PostForm from 'features/Post/PostForm';
import Draft from 'features/Post/Draft';
import NotFound from 'components/NotFound';

const Home = asyncComponent(() => import('pages/Home'));
const Terms = asyncComponent(() => import('pages/Terms'));
const Privacy = asyncComponent(() => import('pages/Privacy'));
const Cookies = asyncComponent(() => import('pages/Cookies'));
const HuntedList = asyncComponent(() => import('pages/HuntedList'));
const Profile = asyncComponent(() => import('features/User/Profile'));

const BackButton = withRouter(({ history }) => (
  <Icon
    type="left"
    className="back-button"
    onClick={() => { history.go(-1) }}/>
));

export class RoutesLeft extends Component {
  shouldLeftBeActive() {
    const path = window.location.pathname;
    return ((/^\/@.+/).test(path) && !(/.+\/edit$/).test(path)) || /^\/(about|terms|privacy|cookies)/.test(path);
  }

  render() {
    let className = 'panel-left';
    if (this.shouldLeftBeActive()) {
      className = 'panel-left active';
    }

    return (
      <div className={className} id="panel-left">
        <BackButton/>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" exact component={Home} />
          <Route path="/@:author/:permlink" exact component={Post} />
          <Route path="/post" exact component={Draft} />
          <Route path="/@:author/:permlink/edit" exact component={Draft} />
          <Route path="/@:author" component={Profile} />
          <Route path='/terms' component={Terms} />
          <Route path='/privacy' component={Privacy} />
          <Route path='/cookies' component={Cookies} />
          <Route path='*' component={NotFound} />
        </Switch>
      </div>
    );
  }
}

class Right extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    getMe: PropTypes.func.isRequired,
  };

  componentDidMount() {
    let accessToken = null;
    if (this.props.location.search) {
      accessToken = queryString.parse(this.props.location.search).access_token;
    }

    this.props.getMe(accessToken); // with existing token
  }

  render() {
    return (
      <div className="panel-right">
        {this.props.location.search && <Redirect to="/" /> /* Authentication redirection */ }
        <Header/>
        <Switch>
          <Route path="/" exact component={HuntedList} />
          <Route path="/about" exact component={HuntedList} />
          <Route path="/post" exact component={PostForm} />
          <Route path="/@:author/:permlink/edit" exact component={PostForm} />
          <Route path="/@:author" component={HuntedList} />
          <Route path="/@:author/:permlink" exact component={HuntedList} />
          <Route path='*' component={HuntedList} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => createStructuredSelector({
  me: selectMe(),
});

const mapDispatchToProps = dispatch => ({
  getMe: token => dispatch(getMeBegin(token)),
});

export const RoutesRight = withRouter(connect(mapStateToProps, mapDispatchToProps)(Right));
