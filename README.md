# SPA Battle

The goal of this project is comparison of most popular front-end frameworks in action.
We implemented the same simple Hero Book app with React, AngularJS1, Angular (^2), Ember and VUE.
The project is in development, after all implementations are done - we will try to compare pros and cons of each framework.

Each implementation sits in own branch (see `react`, `angularjs1`, `angular2`, `ember` and `vue` branches).

App builds are available under the links below.
**Please note, SPAs update browser's address bar dynamically, while GitHub Pages engine doesn't support redirection. Thus start from initial link every time you want to reload page with the app.**

* [React App](https://steelkiwi.github.io/spa-battle/react/)
* [AngularJS 1 App](https://steelkiwi.github.io/spa-battle/angularjs1/)
* [Angular (^2) App](https://steelkiwi.github.io/spa-battle/angular2/)
* [Ember App](https://steelkiwi.github.io/spa-battle/ember/)
* [VUE App](https://steelkiwi.github.io/spa-battle/vue/)

## App Requirements

The app is simple comix hero catalogue with next functionality:

* auth with Google account via Firebase
* random hero list from Marvel API endpoint with load more, search by name, sort, filter favorites, filter rated features
* user's favorite heroes list
* hero details page (+ set rating, favorite/unfavorite features for authenticated users)
* dedicated chat room for each hero
