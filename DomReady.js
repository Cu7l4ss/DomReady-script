(function() {
    var DomReady = rur = {}, isReady = false;
    var readyBound = false;
    rur.stack = [];
    rur.ready = function (args) {
        rur.bindReady();
         if ( isReady && typeof args === "function" ) {
             args.call(document);
         } else if ( rur.stack && typeof args === "function" ) {
             rur.stack.push(args);
             return;
         } else if (isReady && rur.stack) {
             if (!document.body)
                 return setTimeout(rur.ready, 1);
            var fn, i = 0;
            while(( fn = rur.stack[i++])) {
                fn.call(document);
            }    
            
            rur.stack = null;
         }
    };
    
    rur.bindReady = function () {
        if(readyBound) {
            return;
        }
        readyBound = true;

        // Catch cases where ready() is called after the
        // browser event has already occurred.
        if(document.readyState === "complete") {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            return setTimeout(rur.ready, 1);
        }

        // Mozilla, Opera and webkit nightlies currently support this event
        if(document.addEventListener) {
            // Use the handy event callback
            document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

            // A fallback to window.onload, that will always work
            
            window.addEventListener("load", rur.ready, false);

            // If IE event model is used
        } else if(document.attachEvent) {
            // ensure firing before onload,
            // maybe late but safe also for iframes
            document.attachEvent("onreadystatechange", DOMContentLoaded);

            // A fallback to window.onload, that will always work
            window.attachEvent("onload", rur.ready);

            // If IE and not a frame
            // continually check to see if the document is ready
            var toplevel = false;

            try {
                toplevel = window.frameElement == null;
            } catch(e) {
            }

            if(document.documentElement.doScroll && toplevel) {
                doScrollCheck();
            }
        }    
    };
    function doScrollCheck() {
        if(rur.isReady) {
            return;
        }

        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll("left");
        } catch(e) {
            setTimeout(doScrollCheck, 1);
            return;
        }

        // and execute any waiting functions
        rur.ready();
    }
    
    if(document.addEventListener) {
        DOMContentLoaded = function() {
            document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
            isReady = true;
            rur.ready();
        };
    } else if(document.attachEvent) {
        DOMContentLoaded = function() {
            if(document.readyState === "complete") {
                isReady = true;
                document.detachEvent("onreadystatechange", DOMContentLoaded);
                rur.ready();
            }
        };
    }
    
    if(!!window)
        window.DomReady = rur;
}());