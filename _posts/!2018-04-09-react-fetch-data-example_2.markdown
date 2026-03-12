---
title: "Fetching Data with React/Redux for an Infinity Scroll Component Part 2"
layout: post
date: 2018-04-09 10:00
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

This article is a continuation of Part 1. Here, I'll walk you through displaying data using the Infinity Scroll UX pattern.

Let's start with the API. We'll add a new action called REDDIT_INFO_REQUESTED_MORE_DATA alongside the existing ones, resulting in:

```javascript
export const REDDIT_INFO_REQUESTED_FIRST_PAGE = 'REDDIT_INFO_REQUESTED_FIRST_PAGE';
export const REDDIT_INFO_REQUESTED_MORE_DATA = 'REDDIT_INFO_REQUESTED_MORE_DATA';
export const REDDIT_INFO_RECCEIVED = 'REDDIT_INFO_RECCEIVED';
export const REDDIT_INFO_ERROR = 'REDDIT_INFO_ERROR';
```

```javascript
const requestMoreData = () => {
    return {
        type: REDDIT_INFO_REQUESTED_MORE_DATA
    }
};
```

We also need to add an action creator for the new action:

```javascript
export const fetchMoreData = () => (dispatch, getState) => {
    dispatch(requestMoreData());
    return fetch("https://www.reddit.com/subreddits/popular/.json?after="
                   + getState().RedditStore.reddit.skipToken)
        .then(response => response.json())
        .then(responseJson => {
            dispatch(receiveData(responseJson))
        })
        .catch(error => {
            dispatch(receiveError(error))
        });
};
```
As you can see, we need to pass the skipToken from the previous request in the API call. To retrieve it, we use the getState function.

We also need to update the reducer:
```javascript
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

        case ActionTypes.REDDIT_INFO_REQUESTED_MORE_DATA:
            return {
                reddit: {
                    ...state.reddit,
                    isFetching: true,
                    error: {}
                }
            };

        case ActionTypes.REDDIT_INFO_RECCEIVED:
            return {
                reddit: {
                    isFetching: false,
                    data: [...state.reddit.data, ...action.data],
                    skipToken: action.skipToken
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
This way, when new data is received, it gets appended to the previously loaded list.

The next step is to modify RedditInfoList. Here's what we add:
```javascript
class RedditInfoList extends React.Component {

    _onScroll = () => {
        let {isFetching} = this.props.reddit;
        if (!isFetching && this.scrollElement) {
            if (this.scrollElement.scrollTop ===
                             (this.scrollElement.scrollHeight - this.scrollElement.offsetHeight)) {
                this.props.fetchMoreData();
            }
        }
    }

    constructor(props) {
        super(props);
        this.scrollElement = null;
    }

    componentDidMount() {
        this.props.fetchFirstPage();
    }

    render() {
        let {data} = this.props.reddit;
        return (
            <div ref={ref => this.scrollElement = ref}
                 onScrollCapture={this._onScroll}
                 style={{
                     maxHeight: "70vh",
                     overflowX: "hidden",
                     overflowY: "auto",
                     position: "relative"
                 }}>
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
```
The key changes are: we added an onScroll method that fires every time the user scrolls. Inside it, we check whether we need to fetch more data. We also create a reference to our div (which serves as the scrollable container) using ref. You can read more about this mechanism [here][3].

Now, if we run our example, we'll see a list of 25 items, and scrolling to the bottom will trigger a request to load more data. This can also be observed in the browser's console logs.

Let's dig a little deeper. You may notice that performance has degraded. This is because any state change in RedditInfoList causes a re-render of every RedditInfoItem. To verify this, let's add a console log inside RedditInfoItem's render method:

```javascript
    render() {
        console.log("--> RedditInfoItem --> render()")
        ...
    }
```
Let's look at the output in the browser console:

![Markdowm Image][1]{: style="width:780px"}

We can see that after receiving the data in step 1, all items are rendered in step 2 (25 records). Then, when we request the next page, these items are rendered again (during REDDIT_INFO_REQUESTED_MORE_DATA), and after receiving the response, the 25 existing records are rendered once more along with 25 new ones. This is incorrect behavior — since the data hasn't changed, there's no reason to re-render it.

So let's teach React not to re-render the component. We'll do this by overriding the shouldComponentUpdate method in the RedditInfoItem class. It returns a boolean value indicating whether the component needs to be re-rendered.

```javascript
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.category !== this.props.category)
            || (nextProps.headerImage !== this.props.headerImage)
            || nextProps.headerTitle !== this.props.headerTitle;
    }
```
In this method, we check whether the props responsible for rendering the component have changed. I excluded header_size from the comparison because logically, if the other properties haven't changed, header_size shouldn't change either.

Let's repeat the experiment:

![Markdowm Image][2]{: style="width:780px"}

Now we can see that only the new records are rendered after receiving data from the API.

In conclusion, I'd like to emphasize that in React, it's very important to understand the internal lifecycle of components to avoid performance or rendering issues. It's especially important to keep up with the latest updates, as some changes to the platform (which is still relatively young) can fundamentally alter the approach to building components. [Here's an example][4] of such an announcement on the official project blog.

[1]: /assets/images/posts/2018-04-09/1.png
[2]: /assets/images/posts/2018-04-09/2.png
[3]: https://reactjs.org/docs/refs-and-the-dom.html
[4]: https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html