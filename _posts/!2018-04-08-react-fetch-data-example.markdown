---
title: "Fetching Data with React/Redux Part 1"
layout: post
date: 2018-04-08 10:00
image: /assets/images/markdown.jpg
headerImage: false
tag:
- React
- Redux
- Frontend
category: blog
author: balynsky
sitemap: false
description: A typical data fetching scenario using React/Redux
---

This article covers building a typical data fetching scenario using React/Redux to display a simple list of data. For our example, we'll use the API from reddit.com.

You can read more about React [here][3] and about Redux [here][4].

Let's start by creating a basic React project:

```
npx create-react-app infinity-scroll
```

Navigate to the project directory and add the required modules:

```
npm install --save react-redux <br/>
npm install --save-dev redux-devtools <br/>
npm install --save thunk
```

We'll begin by defining the actions.

**Actions** are structures that transmit data from your application to the store. By convention, actions must have a string `type` field that indicates the type of action being performed.

```javascript
export const REDDIT_INFO_REQUESTED_FIRST_PAGE = 'REDDIT_INFO_REQUESTED_FIRST_PAGE';
export const REDDIT_INFO_RECCEIVED = 'REDDIT_INFO_RECCEIVED';
export const REDDIT_INFO_ERROR = 'REDDIT_INFO_ERROR';

const requestData = () => {
    return {
        type: REDDIT_INFO_REQUESTED_FIRST_PAGE
    }
};

const receiveData = (json) => {
    return {
        type: REDDIT_INFO_RECCEIVED,
        skipToken: json.data.after,
        data: json.data.children
    }
};

const receiveError = (error) => {
    return {
        type: REDDIT_INFO_ERROR,
        skipToken: '',
        error: error,
        data: []
    }
};
```
As a result, we created functions responsible for initiating the data fetching process and handling the results (either a successful response or an error).

Let's move on.

**Action creators** are functions that create actions. In Redux, action creators are pure functions.

```javascript
export const fetchRedditData = () => (dispatch, getState) => {
    dispatch(requestData());
    return fetch("https://www.reddit.com/subreddits/popular/.json")
        .then(response => response.json())
        .then(responseJson => {
            dispatch(receiveData(responseJson))
        })
        .catch(error => {
            dispatch(receiveError(error))
        });
};
```
Here we defined a function for fetching data from the site. At the beginning of the function, we notify the store that the operation has started (requestData), and based on the result, we call the appropriate function (receiveData or receiveError).

**Reducers** are responsible for modifying application state. They are functions with the following contract: (previousState, action) => newState. It's very important to never mutate the original state in a reducer. Instead, you should create a new state based on the properties of previousState. Failing to do so can lead to unintended side effects.

```javascript
import * as ActionTypes from '../actions';

const getInitialState = () => {
    return {
        reddit: {
            isFetching: false,
            data: [],
            skipToken: '',
            error: {}
        },
    }
};

export default function RedditStore(state = getInitialState(), action) {
    switch (action.type) {
        case ActionTypes.REDDIT_INFO_REQUESTED_FIRST_PAGE:
            return {
                reddit: {
                    isFetching: true,
                    data: [],
                    error: {}
                }
            };

        case ActionTypes.REDDIT_INFO_RECCEIVED:
            return {
                reddit: {
                    isFetching: false,
                    data: action.data
                }
            }

        case
        ActionTypes.REDDIT_INFO_ERROR:
            return {
                reddit: {
                    isFetching: false,
                    data: [],
                    error: action.error
                }
            };

        default:
            return state;
    }
}
```
Since each action must have its own handler in the reducer, we created handlers for our 3 actions. When REDDIT_INFO_REQUESTED_FIRST_PAGE is received, we set the isFetching flag, which indicates that a request is in progress. Later, this status can be used to display a loader or to prevent multiple concurrent requests to the same data source.

For more details on state types, check out the article [The 5 Types Of React Application State][1] by James K Nelson.

Now let's register our Store. To do this, we'll modify App.js by adding store creation and wrapping it with a Provider that references the created store.

```javascript
const store = createStore(combineReducers({RedditStore}), applyMiddleware(thunk, createLogger()));

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h1 className="App-title">Welcome to React</h1>
                    </header>
                    <RedditInfoList/>
                </div>
            </Provider>
        );
    }
}

export default App;
```

As you can see, in the App class we added a new component called RedditInfoList. This component is a Smart component. Its primary purpose is to subscribe to store changes and perform data manipulation operations. Here is its code:

```javascript
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchMoreData, fetchRedditData} from '../actions'
import {RedditInfoItem} from './RedditInfoItem';

class RedditInfoList extends React.Component {

    componentDidMount() {
        this.props.fetchFirstPage();
    }

    render() {
        let {data} = this.props.reddit;
        return (
            <div>
                {data.map((item, index) => (
                    <RedditInfoItem key={index}
                                    category={item.data.advertiser_category}
                                    headerImage={item.data.header_img}
                                    headerSize={item.data.header_size}
                                    headerTitle={item.data.header_title}
                    />
                ))}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        reddit: state.RedditStore.reddit
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchFirstPage: bindActionCreators(fetchRedditData, dispatch),
        fetchMoreData: bindActionCreators(fetchMoreData, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RedditInfoList)
```

Pay special attention to the bottom part of the file, where the connect function is used. It links RedditInfoList through mapStateToProps and mapDispatchToProps to the action creators and the store on one side, and to props on the other.

Now let's look at the RedditInfoItem component. In our case, this is a Dumb component (meaning a component responsible solely for rendering data).

Here is its code:
```javascript
export class RedditInfoItem extends React.Component {
    static propTypes = {
        category: PropTypes.string,
        headerImage: PropTypes.string,
        headerSize: PropTypes.array,
        headerTitle: PropTypes.string
    };

    render() {
        let {category, headerImage, headerSize, headerTitle} = this.props;
        return (
            <div>
                {category}
                <br/>
                {headerTitle}
                {headerImage &&
                    <img src={headerImage} width={headerSize[0]} height={headerSize[1]}/>
                }
            <hr/>
            </div>
        )
    }
}
```
Note the propTypes section, which describes the input props for this component. Declaring types is a good practice. If you want to set default values for props, you can use a similar declaration called defaultProps. Read [more here][5].

Now, if we run the application, we'll see the following screen (don't mind the design — the output is purely for demonstration purposes):
![Markdowm Image][2]{: style="width:780px"}

What's still missing is a loader displayed while the data is being fetched. To add this, we'll modify the render function of the RedditInfoList class:
```javascript
render() {
    let {data, isFetching} = this.props.reddit;
    return (
            {isFetching ?
                    <div>
                        {data.map((item, index) => (
                            <RedditInfoItem key={index}
                                            category={item.data.advertiser_category}
                                            headerImage={item.data.header_img}
                                            headerSize={item.data.header_size}
                                            headerTitle={item.data.header_title}
                            />
                        ))}
                    </div>
                    :
                    <div>Loading</div>
            }
        )
}
```
This way, while data is being fetched from the source (i.e., the isFetching flag is set), the text "Loading" will be displayed.

In summary, we created a simple React/Redux example for fetching and displaying data from a third-party API.

[1]: http://jamesknelson.com/5-types-react-application-state/
[2]: /assets/images/posts/2018-04-08/1.png
[3]: https://reactjs.org
[4]: https://redux.js.org
[5]: https://reactjs.org/docs/typechecking-with-proptypes.html