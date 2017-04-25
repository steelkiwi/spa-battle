import app from 'index';

function HideRatedFilter() {
    return (items, shouldHide) => {
        let filtered = [];
        if (shouldHide) {
            filtered = items.filter(item => item.rating === 0);
        } else {
            filtered = items;
        }
        return filtered;
    };
}

export default app.filter('hideRated', HideRatedFilter);
