import app from 'index';

function HideFavoritesFilter() {
    return (items, shouldHide) => {
        let filtered = [];
        if (shouldHide) {
            filtered = items.filter(item => !item.isFavorite);
        } else {
            filtered = items;
        }
        return filtered;
    };
}

export default app.filter('hideFavorites', HideFavoritesFilter);
