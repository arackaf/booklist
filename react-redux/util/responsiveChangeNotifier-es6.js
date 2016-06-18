class ResponsiveNotifier{
    constructor(cb){
        this.notifySize = function notifySize(){
            if(ResponsiveBootstrapToolkit.is("xs") ) {
                cb('xs');
            }

            if(ResponsiveBootstrapToolkit.is("sm") ) {
                cb('sm');
            }

            if(ResponsiveBootstrapToolkit.is("md") ) {
                cb('md');
            }

            if(ResponsiveBootstrapToolkit.is(">md") ) {
                cb('lg');
            }
        };

        $(window).on('resize', this.notifySize);
        this.notifySize();
    }
    dispose(){
        $(window).off('resize', this.notifySize);
    }
}

export default ResponsiveNotifier;