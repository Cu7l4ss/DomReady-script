var DomReady = (function(my) {
	my = my || {};
	var readyList = [],
		isReady = my.isReady = false,
		readyBound = false,
		readyWait = 1,
		DOMContentLoaded,
		ready = my.ready = function (fn) {
			
			my.bindReady();
			
				
			if ( isReady && typeof fn === "function") {
				fn.call(document);
			} else if ( readyList && typeof fn === "function") {
				readyList.push(fn);
				return;
			} else if ( isReady && readyList ) {

				if ( !document.body ) {
						return setTimeout( DomReady.ready, 1 );
				}
				// Execute all of them
				var fn, i = 0;
				while ( (fn = readyList[ i++ ]) ) {
					fn.call( document, DomReady );
				}

				// Reset the list of functions
				readyList = null;
			}
		},
		bindReady = my.bindReady = function () {
			if ( readyBound ) {
				return;
			}

			readyBound = true;

			// Catch cases where DomReady.ready() is called after the
			// browser event has already occurred.
			if ( document.readyState === "complete" ) {
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				return setTimeout( DomReady.ready, 1 );
			}

			// Mozilla, Opera and webkit nightlies currently support this event
			if ( document.addEventListener ) {
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

				// A fallback to window.onload, that will always work
				window.addEventListener( "load", DomReady.ready, false );

			// If IE event model is used
			} else if ( document.attachEvent ) {
				// ensure firing before onload,
				// maybe late but safe also for iframes
				document.attachEvent("onreadystatechange", DOMContentLoaded);

				// A fallback to window.onload, that will always work
				window.attachEvent( "onload", DomReady.ready );

				// If IE and not a frame
				// continually check to see if the document is ready
				var toplevel = false;

				try {
					toplevel = window.frameElement == null;
				} catch(e) {}

				if ( document.documentElement.doScroll && toplevel ) {
					doScrollCheck();
				}
			}
		};
	
	function doScrollCheck() {
		if ( isReady ) {
			return;
		}

		try {
			// If IE is used, use the trick by Diego Perini
			// http://javascript.nwbox.com/IEContentLoaded/
			document.documentElement.doScroll("left");
		} catch(e) {
			setTimeout( doScrollCheck, 1 );
			return;
		}

		// and execute any waiting functions
		my.ready();
	}
	
	if ( document.addEventListener ) {
		DOMContentLoaded = function() {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			isReady = my.isReady = true;
			my.ready();
		};
	} else if ( document.attachEvent ) {
		DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( document.readyState === "complete" ) {
				isReady = my.isReady = true;
				document.detachEvent( "onreadystatechange", DOMContentLoaded );
				my.ready();
			}
		};
	}
	
	return my;	
}(DomReady || {}));