import ResponsiveNotifier from './responsiveChangeNotifier';

const responsiveBsSizes = ['xs', 'sm', 'md', 'lg'];

export default function responsiveMobileDesktopMixin(self, stateName, config){
    let currentlyMobile;

    const cutoff = config.cutoff || 'sm';
    const mobileCutoffIndex = responsiveBsSizes.indexOf(cutoff);

    if (!self.state){
        self.state = { [stateName]: null };
    } else {
        self.state[stateName] = null;
    }

    self.responsiveNotifier = new ResponsiveNotifier(val => checkSize(val));

    self.switchToMobile = function(){
        this.overridden = true;
        loadComponent.call(self, config.mobile, true);
    };

    self.switchToDesktop = function(){
        this.overridden = true;
        loadComponent.call(self, config.desktop, false);
    };

    const originalComponentWillDismount = self.componentWillUnmount;
    self.componentWillUnmount = function(){
        this.responsiveNotifier.dispose();
        typeof originalComponentWillDismount === 'function' && originalComponentWillDismount.call(this);
    };

    function checkSize(currentSize){
        if (self.overridden) return;

        let isMobile = responsiveBsSizes.indexOf(currentSize) <= mobileCutoffIndex;
        if (isMobile !== currentlyMobile){
            currentlyMobile = isMobile;
            loadComponent(currentlyMobile ? config.mobile : config.desktop, isMobile);
        }
    }

    function loadComponent(componentObjOrPath, isMobile){
        let componentPath;

        if (typeof componentObjOrPath === 'object'){
            componentPath = componentObjOrPath.path;
        } else {
            componentPath = componentObjOrPath;
        }
        System.import(componentPath).then(({ default: component }) => {
            self.setState({ [stateName]: component, isMobile });
        });
    }
}
