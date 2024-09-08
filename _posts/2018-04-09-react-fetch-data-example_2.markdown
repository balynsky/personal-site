---
title: "Загрузка данных с использованием React/Redux для компонента Infinity Scroll ч.2"
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
description: Типовой сценарий загрузки данных с использованием React/Redux
---

Данная статья является продолжением первой части, в данной статье я познакомлю Вас с отображением информации 
с использованием UX паттерана Infinity Scroll.

Начнем с API, для этого добавим новый екшн REDDIT_INFO_REQUESTED_MORE_DATA и добавим его к другим, в итоге у нас 
получится:

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

Также необходимо добавить генератор действий для нового action:

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
Как видим, мы должны передать в вызов API skipToken из прошлого запроса. Для его получения мы используем функцию getState

Также нам необхоимо изменить reducer
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
Таким образом при получении данных, мы добавляем их к ранее загруженному списку.

Следующий шаг - модифицировать RedditInfoList, и мы добавляем туда 
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
Основные изменения: мы добавляем туда метод onScroll, который будет вызываться всякий раз при использовании прокрутки. В 
нем мы анализируем, нужно ли нам запросить новые данные. Так же мы создаем ссылку на наш div (который используется как
контейнер с прокруткой) с использованием ref. Почитать об этом механизме можно [здесь][3].

Теперь если запустить наш пример, мы увидим список из 25 элементов и, если долистать его до конца - пойдет запрос на догрузку 
новой информации. Что можно увидеть и в логах консоли браузера

Немного углубимся, как можно заметить - ухудшилась производительность. Это стало из за того, что при любом
изменении состояния RedditInfoList постоянно происходит перерисовка RedditInfoItem. Чтобы убедится в этом, добавим в 
RedditInfoItem в метод render вывод данных в консоль


```javascript
    render() {
        console.log("--> RedditInfoItem --> render()")
        ...
    }
```
Давайте посмотрим на результат выполнения в консоле браузера:

![Markdowm Image][1]{: style="width:780px"}

Мы видим, что после получения данных на шаге 1 происходит отрисовка все объектов на шаге 2 (25 записей),
далее, когда мы запрашиваем информацию следующей страницы, мы отрисовываем еще раз эти объекты на странице(во время получения
REDDIT_INFO_REQUESTED_MORE_DATA), а 
уже после получения информации еще раз отрисовываем 25 старых записей и еще 25 новых. Это не является корректным
поведением, так как информация не изменилась и ее нет смысла перерисовывать. 

Поэтому давайте научим React не перерисовывать компонент. Для этого мы переопределим метод shouldComponentUpdate 
в классе RedditInfoItem. Он возвращает значение типа bool, которое указывает на необходимость перерисовать компонент.

```javascript
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.category !== this.props.category)
            || (nextProps.headerImage !== this.props.headerImage)
            || nextProps.headerTitle !== this.props.headerTitle;
    }
```
В это методе мы анализируем - изменились ли props компонента, отвечающие за его отображение. Я убрал из сравнения 
header_size, так как по логике при не измененном состоянии остальных свойств, header_size не должен меняться. 

И попробуем повторить данный эксперимент 

![Markdowm Image][2]{: style="width:780px"}

И теперь мы видим, что произошла отрисовка только новых записей после получения информации от API. 

Резюмируя, хочу обратить внимание, что в React очень важно понимать внутренний LifeCycle компонентов, чтобы не получить
проблем с производительностью или отображением. Особенно следует уделять внимание новостям, так как некоторые изменения
платформы (которая достаточно молодая) кардинально изменяют подходы к созданию компонентов. [Пример][4] такой записи на 
официальном блоге проекта.

[1]: /assets/images/posts/2018-04-09/1.png
[2]: /assets/images/posts/2018-04-09/2.png
[3]: https://reactjs.org/docs/refs-and-the-dom.html
[4]: https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
