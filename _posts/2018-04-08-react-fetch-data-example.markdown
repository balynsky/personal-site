---
title: "Загрузка данных с использованием React/Redux ч.1"
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
description: Типовой сценарий загрузки данных с использованием React/Redux
---

Статья будет посвящена созданию типового сценария по загрузке данных с использованием  React/Redux в виде
просто списка данных. Для нашего примера возьмем API с сайта reddit.com

Почитать об React можно [здесь][3], о Redux [здесь][4]

Для начала создадим базовый проект на React

```
npx create-react-app infinity-scroll
```

Зайдем в каталог проекта и добавим необходимые модули

```
npm install --save react-redux <br/>
npm install --save-dev redux-devtools <br/>
npm install --save thunk
```

Создание проекта начнем с описания действий

**Действия (action)** — это структура, которая передает данные из вашего приложения в хранилище. 
По соглашению, действия должны иметь строковое поле type, которое указывает на тип исполняемого действия.

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
В результате мы создали функции отвечающие за старт процесса получения данных с сайта и за обработку результатов (успешное 
выполнение или ошибка)

Идем дальше

**Генераторы действий (action generators)** — функции, которые создают действия. В Redux генераторы действий 
являются чистыми функциями.

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
Мы описали функцию для получения информации с сайта, в начале функции мы оповещаем store о начале операции (requestData),
а по результатам выполнения вызываем соответствующую функцию (receiveData или receiveError).

**Редьюсеры** отвечают за модификации состояний приложения. Это функции со следующим контрактом 
(previousState, action) => newState. Очень важно никогда изменять исходное состояние в редьюсере. 
Вместо этого необходимо создавать новое состояние на базе свойств previousState. 
В противном случае это может иметь нежелательные последствия.

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
Так как для каждого action должен быть свой обработчик в reducer, мы создали обрабочик для наших 3 действий. При получении
REDDIT_INFO_REQUESTED_FIRST_PAGE - мы устанавливаем флаг isFetching, что означает что запрос в процессе выполнения. В 
дальнейшем на этот статус можно завязать отображение loader'а или помочь избежать выполнения нескольких параллельных запросов
на данный источник.

Подробнее о типах состояний можно прочитать в статье [The 5 Types Of React Application State][1] (James K Nelson)

Теперь зарегистрируем наш Store, для этого изменим App.js, добавив туда создания store и обверку Provider со ссылкой
на созданный store.

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

Как видим в классе App мы добавили новый компонент RedditInfoList. Данный компонент является Smart комонентом. Его основное 
назначение - подписка на изменения store и выполнения операций по манипуляции с данными. Ниже 
представлен его код:

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

Основное внимание стоит уделить нижней части файла, где используется функция connect. Она связывает RedditInfoList через
функции mapStateToProps и mapDispatchToProps с генераторами действий и стором с одной стороны и props с другой.

Теперь рассмотрим компонент RedditInfoItem, в нашем случае это уже Dummy компонент (то есть компонент, отвественный только
за отображением данных)

Код его представлен ниже:
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
Стоит обратить внимание на секцию propTypes, которая описывает входные props для данного компонента. Декларирование 
типов является хорошой практикой. Если вы захотите задать дефолтные значения для props, можно воспользоваться 
аналогичным объявлением defaultProps. Почитать [подробнее][5] 

Теперь, если запустить приложение, мы увидим следующую картинку (не стоит обращать внимание на дизайн, так как вывод
информации сделан исключительно для примера):
![Markdowm Image][2]{: style="width:780px"}

Что нам не хватает - добавить в код отображение loader на время загрузки данных, для этого мы модифицируем класс RedditInfoList
в части функции render:
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
Таким образом, пока идет получение информации из источника данных (установлен флаг isFetching), будет отображаться надпись 
"Loading"

По итогам статьи мы создали просто пример на React/Redux для получения и отображения информации с использованием
стороннего API. 

[1]: http://jamesknelson.com/5-types-react-application-state/
[2]: /assets/images/posts/2018-04-08/1.png
[3]: https://reactjs.org
[4]: https://redux.js.org
[5]: https://reactjs.org/docs/typechecking-with-proptypes.html
