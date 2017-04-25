import app from 'index';

class EnterSender {
    static get $inject() {
        return [];
    }

    link(scope, element, attrs) {
        element.bind('keydown keypress', event => {
            if (event.which === 13) {
                scope.$apply(() => {
                    scope.$eval(attrs.enterSender);
                });
                event.preventDefault();
            }
        });
    }
}

export default app.directive('enterSender', () => new EnterSender());
