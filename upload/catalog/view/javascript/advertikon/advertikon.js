( function outerClosure( $ ) {
	"use strict";

	var
		animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
		isAnimationEnd = false;

	if ( !window.ADK ) {
		window.ADK = {};
	}

	if ( !window.ADK.locale ) {
		window.ADK.locale = {};
	}

	if ( ADK.processed ) {
		return;
	}

	$.extend( window.ADK.locale, {
		scriptError:         "Script Error",
		serverError:         "Server Error",
		undefinedServerResp: "Undefined Sever Response",
		modalHeader:         "Title",
		no:                  "No",
		yes:                 "Yes",
		sessionExpired:      "Current session has expired",
		parseError:          "Response parse error",
		clipboard:           "Data has been copied into clipboard",
		deleteItem:          "Delete item?"
	} );

	window.ADK.irisHideExceptions = [];

	// // Fancy check-box plug-in
	$.fn.fancyCheckbox = function fc( options ) {

		$.each( this, function eachFc() {

			// Initialize element
			if ( "object" === typeof options || "undefined" === typeof options ) {

				// Already initialized
				if( this.fancyCheckboxed ) {

					return;
				}

				init.call( this );

			// Run one of methods
			} else if( "string" === typeof options ) {
				init.call( this );

				if( "on" === options ) {
					on.call( this );

				} else if ( "off" === options ) {
					off.call( this );

				} else if ( "toggle" === options ) {
					toggle.call( this );

				} else if ( "toggle-view" === options ) {
					toggleView.call( this );

				} else if ( "disable" === options ) {
					disable.call( this );

				} else if ( "enable" === options ) {
					enable.call( this );
				}
			}
		} );

	// 	/**
	// 	 * Initialize element
	// 	 * @returns {void}
	// 	 */
		function init() {

			var
				$this = $( this ),
				defaults = null,
				settings = {};

			if( this.fc_inited ) {
				return;
			}

			defaults = {
				wrapper: "<span class='fc-wrapper'>" +
							"<span class='fc-inner'>" +
								"<span class='fc-off'></span>" +
								"<span class='fc-middle'></span>" +
								"<span class='fc-on'></span>" +
							"</span>" +
						"</span>",
				width:         80,
				switcherWidth: 30,
				textOn:        "On",
				textOff:       "Off",
				valueOn:       1,
				valueOff:      0
			};

			// Initialization by default values on method call
			options = typeof options === "object" ? options : {};

			if( $this.attr( "data-text-on" ) ) {
				defaults.textOn = $this.attr( "data-text-on" );
			}

			if( $this.attr( "data-text-off" ) ) {
				defaults.textOff = $this.attr( "data-text-off" );
			}

			if( $this.attr( "data-value-on" ) ) {
				defaults.valueOn = $this.attr( "data-value-on" );
			}

			if( $this.attr( "data-value-off" ) ) {
				defaults.valueOff = $this.attr( "data-value-off" );
			}

			if( $this.attr( "data-width" ) ) {
				defaults.width = $this.attr( "data-width" );
			}

			// Merge options with defaults
			settings = $.extend( defaults, options );

			if( $this.attr( "data-dependent-on" ) ) {
				this.fc_dependentOn = $this.attr( "data-dependent-on" );
			}

			if( $this.attr( "data-dependent-off" ) ) {
				this.fc_dependentOff = $this.attr( "data-dependent-off" );
			}

			// Slider width
			this.fc_shift = settings.width - settings.switcherWidth;

			// Make element and initialize it dimensions
			this.fc_wrapper = $( settings.wrapper );
			$this.after( this.fc_wrapper );

			this.fc_inner = this.fc_wrapper.find( ".fc-inner" );
			this.fc_switcher = this.fc_wrapper.find( ".fc-middle" );

			this.fc_wrapper.css( "width", settings.width + "px" )
				.find( ".fc-middle" )
				.css( "width", settings.switcherWidth + "px" )
				.end()
				.find( ".fc-on, .fc-off" )
				.css( "width", this.fc_shift + "px" )
				.end()
				.find( ".fc-inner" )
				.css( "width", 2 * this.fc_shift + settings.switcherWidth + "px" )
				.end()
				.on( "click", switchStatus );

			// Set back link
			this.fc_wrapper[ 0 ].fc_input = this;

			// Set captions
			this.fc_wrapper.find( ".fc-on" ).html( settings.textOn );
			this.fc_wrapper.find( ".fc-off" ).html( settings.textOff );

			$this.on( "change", checkStatus );

			this.fc_inited = true;
			checkStatus.call( this );
		}

		/**
		 * Switches element values
		 * @returns {void}
		 */
		function switchStatus() {
			var input = this.fc_input;

			if ( input.disabled ) {
				return;
			}

			if( ADK.isEmpty( input.value ) ) {
				input.value = 1;

			} else {
				input.value = 0;
			}

			checkStatus.call( input );
			$( input ).trigger( "change" );
		}

		/**
		 * Switches On the element
		 * @param {boolean} silent Fag as whether to trigger change event on the element
		 * @returns {void}
		 */
		function on( silent ) {
			if( true === this.disabled ) {
				return;
			}

			if ( !ADK.isEmpty( this.value ) ) {
				return;
			}

			this.value = 1;
			checkStatus.call( this );

			if( !silent ) {
				$( this ).trigger( "change" );
			}
		}

		/**
		 * Switches Off the element
		 * @param {boolean} silent Flag as whether to trigger change event on the element
		 * @returns {void}
		 */
		function off( silent ) {
			if( true === this.disabled ) {
				return;
			}

			if ( ADK.isEmpty( this.value ) ) {
				return;
			}

			this.value = 0;
			checkStatus.call( this );

			if( !silent ) {
				$( this ).trigger( "change" );
			}
		}

		/**
		 * Toggles the element
		 * @returns {void}
		 */
		function toggle() {

			if( true === this.disabled ) {
				return;
			}

			if( ADK.isEmpty( this.value ) ) {
				on.call( this );
			} else {
				off.call( this );
			}
		}

		/**
		 * Silently toggles the element value (without event)
		 * @returns {void}
		 */
		function toggleView() {

			if( true === this.disabled ) {
				return;
			}

			if( ADK.isEmpty( this.value ) ) {
				on.call( this, true );
			} else {
				off.call( this, true );
			}
		}

		/**
		 * Changes element appearance depend on its value
		 * @returns {void}
		 */
		function checkStatus() {

			if( ADK.isEmpty( this.value ) ) {
				switch_off.call( this );

				if( this.fc_dependentOff ) {
					$( this.fc_dependentOff ).fancyCheckbox( "off" );
				}

			} else {
				switch_on.call( this );

				if( this.fc_dependentOn ) {
					$( this.fc_dependentOn ).fancyCheckbox( "on" );
				}
			}

			clearTimeout( this.fc_animationTimeout );

			( function a( i ) {
				i.fc_animationTimeout = setTimeout( function b() {
					shiftEnd.call( i );
				}, 400 );
			} )( this );
		}

		/**
		* Switch element on
		* @returns {void}
		*/
		function switch_on() {
			this.fc_inner.css( "left", -1 * this.fc_shift + "px" );
		}

		/**
		 * Switch element off
		 * @returns {void}
		 */
		function switch_off() {
			this.fc_inner.css( "left", 0 );
		}

		/**
		 * Shift animation end call-back
		 * @returns {void}
		 */
		function shiftEnd() {
			if( ADK.isEmpty( this.value ) ) {
				this.fc_switcher.removeClass( "on" );
				this.fc_wrapper.css( "border-color", "gray" )
					.removeClass( "fc-switched-on" )
					.addClass( "fc-switched-off" );

			} else {
				this.fc_switcher.addClass( "on" );
				this.fc_wrapper.css( "border-color", "green" )
					.removeClass( "fc-switched-off" )
					.addClass( "fc-switched-on" );
			}
		}

		/**
		 * Disables element
		 * @returns {void}
		 */
		function disable() {
			this.fc_wrapper.addClass( "fc-disabled" )
				.find( "span" )
				.addClass( "fc-disabled" );
			this.disabled = true;
		}

		/**
		 * Enables element
		 * @returns {void}
		 */
		function enable() {
			this.fc_wrapper.removeClass( "fc-disabled" )
				.find( "span" )
				.removeClass( "fc-disabled" );
			this.disabled = false;
		}

		return this;
	};

	/**
	 * Checks value for emptiness
	 * @param {mixed} value Value to be tested
	 * @returns {boolean} Test result
	 */
	ADK.isEmpty = function ie( value ) {
		return typeof value === "undefined" || value === false || "off" === value ||
			"false" === value || null === value || 0 === value || "0" === value;
	};

	/**
	 * Initializes slider element
	 * @param {object} slider Slider element
	 * @returns {void}
	 */
	ADK.initSlider = function is( slider ) {
		var
			$slider = $( slider ),
			data = { animate: true },
			max = $slider.attr( "data-max" ),
			target1 = $( $slider.attr( "data-value1-target" ) ),
			target2 = $( $slider.attr( "data-value2-target" ) ),
			val1 = $slider.attr( "data-value1" ),
			val2 = $slider.attr( "data-value2" );

		// Set "max" value, if applied
		if ( typeof max !== "undefined" ) {
			data.max = parseFloat( max );
		}

		// We have two values - value1 and value2
		if ( typeof val1 !== "undefined" && typeof val2 !== "undefined" ) {
			data.values = [ val1, val2 ];
			data.range = true;

			// Set backward dependence between slider and value1 input element
			target1.on( "change", function sliderVal1Change() {
				$slider.slider( "values", 0, $( this ).val() );
			} );

			// Set backward dependence between slider and value2 input element
			target2.on( "change", function sliderVal1Change() {
				$slider.slider( "values", 1, $( this ).val() );
			} );

		// We have value-1 only
		} else if ( typeof val1 === "undefined" ) {
			console.error( "First value for the range is missing" );

			return;

		// We have value-2 only - consider such situation as an error
		} else {
			data.value = val1;

			// Set backward dependence between slider and value1 input element
			target1.on( "change", function sliderVal1Change() {
				$slider.slider( "value", $( this ).val() );
			} );
		}

		// Set forward dependence between slider and value1(2) input element(s)
		data.slide = function sliderSlide( evt, ui ) {
			if( ui.values ) {
				target1.val( ui.values[ 0 ] );
				target2.val( ui.values[ 1 ] );
				target2.trigger( "input" );

			} else {
				target1.val( ui.value );
			}

			target1.trigger( "input" );
		};

		data.change = function sliderChange( evt, ui ) {
			if( ui.values ) {
				target1.val( ui.values[ 0 ] );
				target2.val( ui.values[ 1 ] );

			} else {
				target1.val( ui.value );
			}

		};

		// Initialize slider
		$( slider ).slider( data );
	};

	/**
	 * Adds switcher functionality to button
	 * @param {(object|jQuery|string)} e Button element
	 * @fires Event#switchable.switch.end
	 * @fires Event#switchable.init.end
	 * @returns {void}
	 */
	ADK.initSwitchable = function is( e ) {
		$( e ).each( function each() {
			initSwitchable( this );
		} );
	};

	/**
	 * Adds switcher functionality to button
	 * @param {(object|jQuery|string)} e Button element
	 * @fires Event#switchable.switch.end
	 * @fires Event#switchable.init.end
	 * @returns {void}
	 */
	function initSwitchable( element ) {
		var
			$element = $( element ),
			i = null,

			// Icons to switch depend on value
			icons = $element.attr( "data-icons" ),
			len = null,

			// Texts to switch between depend on value
			texts = $element.attr( "data-texts" ),

			// Titles to switch between depend on value
			titles = $element.attr( "data-titles" ),
			value = "",

			// Switcher values, at least two
			values = $element.attr( "data-values" );

		if ( element.switchableInitialized ) {
			return;
		}

		// Current switcher value (optional)
		value = $element.attr( "data-value" );
		element.$iconI = $element.find( "i.fa" ).eq( 0 ).addClass( "fa-fw" );
		element.$textI = $element.find( "i" ).not( ".fa" ).eq( 0 ).addClass( "fa-fw" );

		if( typeof values === "undefined" ) {
			console.error( "Switchable needs to have values to switch between" );
			return;
		}

		values = values.split( "," );

		if ( icons ) {
			icons = icons.split( "," );
		}

		if ( texts ) {
			texts = texts.split( "," );
		}

		if ( titles ) {
			titles = titles.split( "," );
		}

		// Trim values, titles, texts, icons values
		// Set number of texts, icons and titles regarding values count
		// If corresponding value is missing - take previous
		for( i = 0, len = values.length; i < len; ++i ) {
			values[ i ] = values[ i ].replace( /^\s+|\s+$/g, "" );

			if( icons ) {
				if( icons[ i ] ) {
					icons[ i ] = icons[ i ].replace( /^\s+|\s+$/g, "" );

				} else {
					icons[ i ] = icons[ i - 1 ];
				}
			}

			if( texts ) {
				if( texts[ i ] ) {
					texts[ i ] = texts[ i ].replace( /^\s+|\s+$/g, "" );

				} else {
					texts[ i ] = texts[ i - 1 ];
				}
			}

			if( titles ) {
				if( titles[ i ] ) {
					titles[ i ] = titles[ i ].replace( /^\s+|\s+$/g, "" );

				} else {
					titles[ i ] = titles[ i - 1 ];
				}
			}
		}

		// If current switcher value is not present - set first value from switcher values
		if( typeof value === "undefined" || "" === value ) {
			element.value = values[ 0 ];

		} else {
			element.value = value;
		}

		// Set current offset as -1 since we'll run set() function later on
		element.currentOffset = values.indexOf( element.value ) - 1;
		element.values = values;
		element.texts = texts;
		element.icons = icons;
		element.titles = titles;

		// Emulate val() functionality
		element.val = function val() {
			return this.value;
		};

		/**
		 * Sets the next state to button
		 * @param {int} index Index of value to be set
		 * @returns {void}
		 */
		function set( index ) {
			element.prevOffset = element.currentOffset;
			index = index || ++element.currentOffset;
			element.currentOffset = index;
			element.currentOffset %= element.values.length;
			element.value = element.values[ element.currentOffset ];

			if( element.icons ) {
				element.$iconI.removeClass( element.icons[ element.prevOffset ] )
					.addClass( element.icons[ element.currentOffset ] );
			}

			if( element.texts ) {
				element.$textI.html( element.texts[ element.currentOffset ] );
			}

			if( element.titles ) {
				$element.attr( "title", element.titles[ element.currentOffset ] );
			}

			ADK.e.trigger( "switchable.switch.end", element );

			if( element.id ) {
				ADK.e.trigger( "switchable.click." + element.id, element );
			}

			ADK.measureUnitsSwitch( element );
		}

		$element.on( "click", set.bind( $element[ 0 ], null ) );

		/**
		 * Sets value of switchable
		 * @param {string} val One of switchable's value
		 * @returns {object} Switchable element itself
		 */
		element.setValue = function setSwitchableValue( val ) {
			var index = $.inArray( val, element.values );

			if( -1 === index ) {
				return this;
			}

			set( index );

			return this;
		};

		element.switchableInitialized = true;

		ADK.e.trigger( "switchable.init.end", element );
		ADK.initMeasureUnitsSwitchable( element );
		set();
	}

	/**
	 * Measure units switcher specific initializations
	 * @param {object} element Switchable
	 * @returns {void}
	 */
	ADK.initMeasureUnitsSwitchable = function ims( element ) {
		var
			$element = $( element ),
			i = 0,
			len = 0,
			maxes = "";

		if( !$element.hasClass( "measure-units" ) ) {
			return;
		}

		maxes = $element.attr( "data-maxes" );
		if( !maxes ) {
			return;
		}

		maxes = maxes.split( "," );

		if( !maxes.length ) {
			return;
		}

		for( i = 0, len = element.values.length; i < len; ++i ) {
			if( maxes[ i ] ) {
				maxes[ i ] = parseFloat( maxes[ i ].replace( /^\s+|\s+$/g, "" ) );

			} else {
				maxes[ i ] = maxes[ i - 1 ];
			}
		}

		element.maxes = maxes;
	};

	/**
	 * Handles change of measure units of profile width slider
	 * @param {object} element Measure unit button
	 * @returns {void}
	 */
	ADK.measureUnitsSwitch = function ms( element ) {
		var
			$element = $( element ),
			$slider = null;

		// Switchable is #template-width-units button
		if ( !$element.hasClass( "measure-units" ) ) {
			return;
		}

		$slider = $element.parents( ".dimension-wrapper" )
			.find( ".slider" );

		if( $slider[ 0 ] ) {
			if( !$slider[ 0 ].oldValues ) {
				$slider[ 0 ].oldValues = {};
			}

			$slider[ 0 ].oldValues[ element.prevOffset ] = $slider.slider( "option", "value" );

			if ( typeof $slider[ 0 ].oldValues[ element.currentOffset ] !== "undefined" ) {
				$slider.slider(
					"option", "value", $slider[ 0 ].oldValues[ element.currentOffset ]
				);
			}

			$slider
				.slider( "option", "max", element.maxes[ element.currentOffset ] )
				.slider( "value", $slider.slider( "value" ) );

			ADK.e.trigger( "switchable.measure_units.switch.end", element );
		}
	};

	/**
	 * Initializes Iris color-picker element
	 * @param {(object|jQuery|string)} e Color-picker element
	 * @returns {void}
	 */
	ADK.initIris = function is( e ) {
		$( e ).each( function each() {
			var element = this;

			$( element ).iris( {
				target: $( element ).parent()
					.parent(),
				width:  300,
				hide:   true,
				change: function colorPickerChange( evt, ui ) {
					setColor( element, ui.color );

					// Iris doesn't trigger change event on target element - do it
					window.clearTimeout( element.irisTimeout );
					element.irisTimeout = setTimeout( function colorPickerChangeDeley() {
						$( element ).trigger( "change" );
					}, 100 );
				}
			} )
				.addClass( "iris-init" );

			// Show color-picker on element get focus
			$( element ).on( "focus", function colorPickerOnFocus() {
				$( element ).iris( "show" );
			} );

			ADK.irisHideExceptions.push( element );

			// Color color-picker add-on
			// It's not an API so may be changed by time
			try {
				setColor(
					element,
					$( element ).data( "a8c-iris" )._color.fromHex( element.value )
				);

			} catch ( error ) {
				console.error( error );
			}
		} );
	};

	/**
	 * Colors color-picker element's input group addon
	 * @param {object} element Color-picker element
	 * @param {object} color jQuery color object
	 * @returns {void}
	 */
	function setColor( element, color ) {
		$( element ).parent()
			.find( ".input-group-addon" )
			.css( {
				"background-color": color.toString(),
				"color":            color.getMaxContrastColor().toString()
			} );
	}

	// Hide Iris color-picker functionality
	// If element is present in irisHideException list - do not hide color-picker
	$( document ).on( "click", function documentClick( evt ) {
		var found = false;

		if ( typeof ADK.isIrisLoaded === "undefined" ) {
			ADK.isIrisLoaded = "iris" in $();
		}

		if ( !ADK.isIrisLoaded ) {
			return;
		}

		$.each( ADK.irisHideExceptions, function iterateOverIrisHideExceptions() {
			if( evt.target === this ) {
				found = true;

				return false;
			}

			return true;
		} );

		if( !found ) {
			$( ".iris-init" ).iris( "hide" );
		}
	} );

	/**
	 * Event constructor
	 * @returns {void}
	 */
	ADK.Event = function e() {
		var
			queue = {};

		/**
		 * Add new event as structure, if event has name-spaces
		 * @param {string} name Event name
		 * @private
		 * @returns {void}
		 */
		function addEvtName( name ) {
			var
				parts = name.split( "." ),
				top = queue;

			$.each( parts, function iterateOverEventNameParts() {
				if ( typeof top[ this ] === "undefined" ) {
					top[ this ] = {};
				}

				top = top[ this ];
			} );
		}

		/**
		 * Returns event object from event structure
		 * @param {string} name Event name
		 * @returns {(object|undefined)} Event object
		 */
		function getEventCalbacks( name ) {
			var
				i = 0,
				newTop = null,
				parts = name.split( "." ),
				top = queue,
				y = null;

			for( i = 0; i < parts.length; i++ ) {
				newTop = {};

				// Traverse over event listeners
				for( y in top ) {
					if( "*" === parts[ i ] || y === parts[ i ] || "*" === y ) {
						newTop = ADK.merge( newTop, top[ y ] );
					}
				}

				if ( $.isEmptyObject( newTop ) ) {
					return false;
				}

				top = newTop;
			}

			return top;
		}

		/**
		 * Returns event object from event structure
		 * @param {string} name Event name
		 * @returns {(object|undefined)} Event object
		 */
		function getEvent( name ) {
			var
				i = 0,
				parts = name.split( "." ),
				top = queue;

			for( i = 0; i < parts.length; i++ ) {
				top = top[ parts[ i ] ];

				if( typeof top === "undefined" ) {
					return null;
				}
			}

			return top;
		}

		/**
		 * Add callback to specific event
		 * @param {string} name Event name
		 * @param {(array|function)} callback Callback function
		 * @returns {void}
		 */
		function addCallback( name, callback ) {
			var evt = getEvent( name );

			if ( typeof evt.callbacks === "undefined" ) {
				evt.callbacks = [];
			}

			evt.callbacks.push( callback );
		}

		/**
		 * Subscribes listener to some event
		 * @param {(string|array)} evtIn Event name
		 * @param {(array|function)} callback Callback function
		 * @returns {void}
		 */
		this.subscribe = function subscribe( evtIn, callback ) {
			var evt = evtIn;

			if ( typeof evtIn !== "object" ) {
				evt = new Array( evtIn );
			}

			$.each( evt, function iterateOverEvtNames() {
				var
					cb = typeof callback === "object" ? callback : new Array( callback ),
					event = this;

				addEvtName( this );
				$.each( cb, function ee() {
					addCallback( event, this );
				} );
			} );
		};

		/**
		 * Sends vent to all the event listeners
		 * @param {string} name Event name
		 * @param {(object|undefined)} data Event data
		 * @returns {void}
		 */
		this.trigger = function trigger( name, data ) {
			var evt = getEventCalbacks( name );

			if ( evt && evt.callbacks ) {
				$.each( evt.callbacks, function interateOverEvents() {

					// Callback is a simple function
					if ( typeof this === "function" ) {
						this( data );

					// Callback is an array: this / method
					} else if ( typeof this === "object" && typeof this.length !== "undefined" &&
						typeof this[ 0 ] === "object" && typeof this[ 1 ] === "function" ) {
						this[ 0 ][ this[ 1 ] ]( data );
					}
				} );
			}
		};
	};

	/**
	 * Merges two objects
	 * Combines arrays rather then override
	 * @param {(array|object)} o1 Object to combine
	 * @param {(array|object)} o2 Object to combine with
	 * @returns {(array|object)} Resulting object
	 */
	ADK.merge = function merge( o1, o2 ) {
		if( typeof o1 !== typeof o2 ) {
			throw "Unable to merge two items, because they have different types";
		}

		if( typeof o1 !== "object" ) {
			throw "Unable to merge scalar values";
		}

		$.each( o2, function eachO2( index, val ) {
			if( typeof o1[ index ] === "undefined" ) {
				o1[ index ] = val;

			// Same type
			} else if ( typeof o1[ index ] === typeof val ) {

				// Array/Object
				if( typeof val === "object" ) {
					merge( o1[ index ], val );

				// Scalar
				// If object - rewrite property
				} else if ( typeof o1.length === "undefined" ) {
					o1[ index ] = val;

				// Array - add if unique
				} else if( $.inArray( val, o1 ) === -1 ) {
					o1.push( val );
				}

			// Different types
			} else if ( typeof o1[ index ] === "object" ) {

				// First element is Object
				if ( typeof o1.length === "undefined" ) {
					o1[ index ] = val;

				// Array
				} else if( $.inArray( val, o1 ) === -1 ) {
					o1.push( val );
				}

			// Scalar
			} else {
				o1[ index ] = val;
			}

		} );

		return o1;
	};

	/**
	 * Modal widow deferred object constructor
	 * @param {(object|undefined)} self This pointer for callbacks functions, optional
	 * @returns {object} New instance
	 */
	ADK.ModalDeffered = function md( self ) {
		var
			hiddenList = [],
			hideList = [],
			noList = [],
			showList = [],
			shownList = [],
			yesList = [];

		/**
		 * Adds show callback
		 * @param {function} func Callback function
		 * @returns {object} this
		 */
		this.show = function show( func ) {
			if ( typeof func === "function" ) {
				showList.push( func );
			}

			return this;
		};

		/**
		 * Adds shown callback
		 * @param {function} func Callback function
		 * @returns {object} this
		 */
		this.shown = function shown( func ) {
			if ( typeof func === "function" ) {
				shownList.push( func );
			}

			return this;
		};

		/**
		 * Adds hide callback
		 * @param {function} func Callback function
		 * @returns {object} this
		 */
		this.hide = function hide( func ) {
			if ( typeof func === "function" ) {
				hideList.push( func );
			}

			return this;
		};

		/**
		 * Adds hidden callback
		 * @param {function} func Callback function
		 * @returns {object} this
		 */
		this.hidden = function hidden( func ) {
			if ( typeof func === "function" ) {
				hiddenList.push( func );
			}

			return this;
		};

		/**
		 * Adds YRS callback (confirm box)
		 * @param {function} func Callback function
		 * @returns {object} this
		 */
		this.yes = function y( func ) {
			if ( typeof func === "function" ) {
				yesList.push( func );
			}

			return this;
		};

		/**
		 * Adds NO callback (confirm box)
		 * @param {function} func Callback function
		 * @returns {object} this
		 */
		this.no = function n( func ) {
			if ( typeof func === "function" ) {
				noList.push( func );
			}

			return this;
		};

		/**
		 * Triggers all the show callbacks
		 * @returns {object} Self
		 */
		this.triggerShow = function triggerShow() {
			$.each( showList, function queue() {
				this.call( self );
			} );

			return this;
		};

		/**
		 * Triggers all the shown callbacks
		 * @returns {object} Self
		 */
		this.triggerShown = function triggerShown() {
			$.each( shownList, function queue() {
				this.call( self );
			} );

			return this;
		};

		/**
		 * Triggers all the hide callbacks
		 * @returns {object} Self
		 */
		this.triggerHide = function triggerHide() {
			$.each( hideList, function queue() {
				this.call( self );
			} );

			return this;
		};

		/**
		 * Triggers all the hidden callbacks
		 * @returns {object} Self
		 */
		this.triggerHidden = function triggerHidden() {
			$.each( hiddenList, function queue() {
				this.call( self );
			} );

			return this;
		};

		/**
		 * Triggers all the YES callbacks
		 * @returns {object} Self
		 */
		this.triggerYes = function ty() {
			$.each( yesList, function queue() {
				this.call( self );
			} );

			return this;
		};

		/**
		 * Triggers all the NO callbacks
		 * @returns {object} Self
		 */
		this.triggerNo = function tn() {
			$.each( noList, function queue() {
				this.call( self );
			} );

			return this;
		};

		/**
		 * Clears all the callbacks queues
		 * @returns {object} Self
		 */
		this.clear = function clear() {
			hiddenList = [];
			hideList = [];
			showList = [];
			shownList = [];
			yesList = [];
			noList = [];

			return this;
		};
	};

	ADK.ModalDeferred = ADK.ModalDeffered;

	/**
	 * A browser's alert substitution
	 * @param {String} msg Alert message
	 * @param {string} title Alert title
	 * @param {string} size Modal size (modal-sm|modal-lg)
	 * @returns {object} Deferred object
	 */
	ADK.alert = function a( msg, title, size ) {

		if ( typeof ADK.alert.instance === "undefined" ) {
			ADK.alert.instance =
			$( "<div class=\"modal fade\" tabindex=\"-1\"" +
				" role=\"dialog\" aria-labelledby=\"modal alert messenger\">" +
						"<div class=\"modal-dialog modal-sm\">" +
						"<div class=\"modal-content\">" +
							"<div class=\"modal-header\">" +
								"<button type=\"button\" class=\"close\" data-dismiss=\"modal\"" +
									"aria-label=\"Close\">" +
										"<span aria-hidden=\"true\">&times;</span>" +
								"</button>" +
								"<h4 class=\"modal-title\">" + ADK.locale.modalHeader + "</h4>" +
							"</div>" +
							"<div class=\"modal-body\">" + msg + "</div>" +
						"</div>" +
				"</div>" );

			ADK.alert.msg = ADK.alert.instance.find( ".modal-body" );
			ADK.alert.title = ADK.alert.instance.find( ".modal-title" );
			ADK.alert.dialog = ADK.alert.instance.find( ".modal-dialog" );

			ADK.alert.deffered = new ADK.ModalDeffered( ADK.alert.instance );

			ADK.alert.instance.on( {
				"show.bs.modal": function showAlert() {
					ADK.alert.deffered.triggerShow();
				},
				"shown.bs.modal": function shownAlert() {
					ADK.alert.deffered.triggerShown();
				},
				"hide.bs.modal": function hideAlert() {
					ADK.alert.deffered.triggerHide();
				},
				"hidden.bs.modal": function hiddentAlert() {
					ADK.alert.deffered.triggerHidden();
					ADK.alert.deffered.triggerYes();
				}
			} );
		}

		ADK.alert.msg.html( msg );
		ADK.alert.title.html( title || ADK.locale.modalHeader );
		ADK.alert.dialog.removeClass( "modal-sm modal-md modal-lg" ).addClass( size || "modal-sm" );

		$( ".modal" ).not( ADK.alert.instance )
			.modal( "hide" );

		ADK.alert.instance.modal( "show" );
		ADK.alert.deffered.clear();

		return ADK.alert.deffered;
	};

	/**
	 * A browser's confirm substitution
	 * @param {String} msg Alert message
	 * @param {function} callbackYes Yes-callback
	 * @param {function} callbackNo No-callback
	 * @returns {void}
	 */
	ADK.confirm = function mc( msg, config ) {

		var isYes = false;

		if ( typeof msg === "undefined" ) {
			msg = "Are you sure?";
		}

		if ( typeof config === "undefined" ) {
			config = {};
		}

		var c = $.extend( config, {
			showNo:  true,
			textYes: ADK.locale.yes,
			textNo:  ADK.locale.no
		} );

		if ( typeof ADK.confirm.instance === "undefined" ) {

			ADK.confirm.instance =
			$( "<div class=\"modal fade\" tabindex=\"-1\"" +
				" role=\"dialog\" aria-labelledby=\"modal alert messenger\">" +
						"<div class=\"modal-dialog modal-sm\">" +
						"<div class=\"modal-content\">" +
							"<div class=\"modal-header\">" +
								"<button type=\"button\" class=\"close\" data-dismiss=\"modal\"" +
									"aria-label=\"Close\">" +
										"<span aria-hidden=\"true\">&times;</span>" +
								"</button>" +
								"<h4 class=\"modal-title\">" + ADK.locale.modalHeader + "</h4>" +
							"</div>" +
							"<div class=\"modal-body\">" + msg + "</div>" +
							"<div class=\"modal-footer\">" +
							( c.showNo ?
								"<button type=\"button\" class=\"btn btn-default\" " +
								"data-dismiss=\"modal\">" +
									c.textNo +
								"</button>"
								: "" ) +
							"<button id=\"modal-yes\" type=\"button\" class=\"btn btn-primary\">" +
								c.textYes +
							"</button>" +
							"</div>" +
						"</div>" +
				"</div>" );

			ADK.confirm.msg = ADK.confirm.instance.find( ".modal-body" );
			ADK.confirm.deffered = new ADK.ModalDeffered( ADK.confirm.instance );

			ADK.confirm.instance.on( {
				"show.bs.modal": function showC() {
					ADK.confirm.deffered.triggerShow();
				},
				"shown.bs.modal": function shownC() {
					ADK.confirm.deffered.triggerShown();
				},
				"hide.bs.modal": function hideC() {
					ADK.confirm.deffered.triggerHide();
				},
				"hidden.bs.modal": function hiddentC() {
					ADK.confirm.deffered.triggerHidden();

					if ( !isYes ) {
						ADK.confirm.deffered.triggerNo();
					}
				}
			} );

			ADK.confirm.instance.find( "#modal-yes" ).on( "click", function c() {
				isYes = true;
				ADK.confirm.instance.modal( "hide" );
				ADK.confirm.deffered.triggerYes();
			} );
		}

		ADK.confirm.msg.html( msg );
		ADK.confirm.instance.modal( "show" );
		ADK.confirm.deffered.clear();

		return ADK.confirm.deffered;
	};

	/**
	 * Makes element background color pulsate for a while
	 * @param {object} elem Element
	 * @param {(integer|undefined)} time Time to pulsate. Default 2 sec.
	 * @returns {void}
	 */
	ADK.pulsate = function p( elem, time ) {
		if ( $( elem ).hasClass( "select2-hidden-accessible" ) ) {
			elem = $( elem ).next( "span" ).find( ".select2-selection" );
		}

		$( elem ).addClass( "pulsate" );

		elem.pulseTimeout = window.setTimeout( function removePusingClass() {
			$( elem ).removeClass( "pulsate" );
		}, time || 2000 );

		// Remove pulsating on focus
		$( elem ).one( "focus", function fulsateOnFocus() {
			clearTimeout( this.pulseTimeout );
			$( this ).removeClass( "pulsate" );
		} );
	};

	/**
	 * Sanitizes and parses JSON string
	 * @param {string} resp AJAX response string
	 * @returns {(null|object)} JSON object
	 */
	ADK.sanitizeAjaxResponse = function sar( resp ) {

		var
			json = null,
			matches = null;

		if ( typeof resp === "object" ) return resp;

		if ( "" === resp || typeof resp !== "string" ) {
			console.error( "Advertikon script: json response: ", resp );
			return null;
		}

		matches = resp.match( /^([^{\[]*)((\{|\[).*(\}|\]))([^}\]]*)$/ );

		if( null === matches ) {
			console.error( resp );

			// ADK.n.alert( ADK.locale.scriptError );

			return json;
		}

		if ( matches[ 1 ] || matches[ 5 ] ) {
			console.error( "Advertikon script: trapped output:" );

			if ( matches[ 1 ] ) {
				console.error( matches[ 1 ] );
			}

			if ( matches[ 5 ] ) {
				console.error( matches[ 5 ] );
			}
		}

		if ( matches[ 2 ] ) { 
			try {
				json = JSON.parse( matches[ 2 ] );

				return json;
			} catch ( e ) {
				console.error( "Advertikon script: ", e );

				// ADK.n.alert( ADK.locale.scriptError );

				return json;
			}
		} else {
			console.error( "Advertikon script: empty AJAX response" );

			// ADK.n.alert( ADK.locale.scriptError );

			return json;
		}
	};

	/**
	 * Checks AJAX response for session expiration
	 * @param {string} resp AJAX response text
	 * @returns {boolean} Result
	 */
	ADK.isSessionexpired = function ise( resp ) {
		return ( /<form.+?action=(["']).+?route=common\/login\1/ ).test( resp );
	};

	/**
	 * Animation extension
	 * @param {object} data Animation parameters
	 *  name - Animation name
	 *  delay - Animation delay, default 0
	 *  duration - Animation duration, default 0
	 *  stop - Whether to stop all queued animations, default false
	 *  stopRunning - Whether to stop currently running animation, default false
	 * @returns {(object|array)} Object(s) on which this method was called
	 */
	$.fn.animationOn = function animate( data ) {

		$.each( this, function iterator() {

			if( typeof this.animationQueue === "undefined" || !ADK.isEmpty( data.stop ) ) {
				this.animationQueue = [];
			}

			if( typeof data === "string" ) {
				data = {
					name: data
				};
			}

			if( ADK.isEmpty( data.name ) ) {
				console.error( "Animation name is missing" );

				return;
			}

			// Sanitize animation data
			data.delay = parseInt( data.delay, 10 ) || 0;
			data.duration = parseInt( data.duration, 10 ) || 4000;

			this.animationQueue.push( data );

			// If there is no running animations or we should stop them all - run animation
			if( data.stopAll || !this.animating ) {
				run.call( this, data.stopAll );
			}

		} );

		/**
		 * Runs animation
		 * @param {boolean} stopAll Flag whether to stop currently running animation
		 * @returns {void}
		 */
		function run( stopAll ) {

			var
				animation = null,
				self = this;

			// Stop all active animations
			if( stopAll ) {
				clearTimeout( this.animationDelay );
				clearTimeout( this.aminationDuration );
				animationEnd.call( this, true );
			}

			// There is no one animation in the queue
			if ( 0 === this.animationQueue.length ) {

				return;
			}

			this.animating = true;

			// Current animation
			animation = this.animationQueue.shift();

			// Delay/Duration functionality
			this.aminationDeley = setTimeout( function animationDelay() {

				// Start animation
				$( self ).addClass( animation.name );

				$( self ).one(
					"webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend",
					animationEnd.bind( self )
				);

				// Remember active animation
				self.currentAnimation = animation.name;

				( function aminationClosure( element ) {
					element.animationDuration = setTimeout( function anumationDuration() {
						$( element ).trigger( "animationend" );
					}, animation.duration );
				} )( self );

			}, animation.delay );

		}

		/**
		 * Stops animation, if any
		 * @param {boolean} stop Flag to not start next queued animation
		 * @returns {void}
		 */
		function animationEnd( stop ) {

			clearTimeout( this.animationDuration );

			if( this.currentAnimation ) {
				$( this ).removeClass( this.currentAnimation );
				this.currentAnimation = null;
			}

			this.animating = false;

			if( typeof stop !== "boolean" ) {
				stop = false;
			}

			if ( !stop ) {

				// Run next animation
				run.call( this );
			}
		}

		return this;
	};

	/**
	 * Add effect on element
	 * effect arguments:
	 *   name - effect name
	 * @param {object} data Effect parameters
	 * @param {boolean} wait Whether to wait or start new effect immediately
	 * @returns {object} Object/object set on which method was called
	 */
	$.fn.effectOn = function effectOn( data, wait ) {

		$.each( this, function effectsIterator() {

			var $this = $( this );

			if( isEmpty( data.name ) ) {
				console.error( "Effect name is missing" );

				return;
			}

			// List of active effects
			if( typeof this.activeEffects === "undefined" ) {
				this.activeEffects = [];
			}

			if ( wait ) {

				// Only one affect of each type can be applied to the element
				if( $.inArray( data.name, this.activeEffects ) >= 0 ) {
					console.error( "Effect '" + data.name +
						"' is currently applied to the element. Effect duplication is forbidden" );

					return;
				}
			} else {
				$this.effectOff( data.name, true );
			}

			switch( data.name ) {

			/*
			 * Element "emerge" up on some distance
			 *  distance - emerge effect distance, default - 0
			 *  units - measure units, default = px
			 */
			case "emerge" :
				this.effectEmergeParentPosition = $this.parent().css( "position" );
				$this.parent().css( "position", "relative" );
				this.effectEmergeWidth = $this.outerWidth();
				this.effectEmergeHeight = $this.outerHeight();
				this.effectEmergeTop = $this.css( "top" );
				this.effectEmergeLeft = $this.css( "left" );
				this.effectEmergeShadow = this.style.boxShadow;
				this.effectEmergeGhostElement = this.cloneNode();
				this.effectEmergePosition = $this.position();

				$this.css( {
					width:  this.effectEmergeWidth,
					height: this.effectHeight,
					top:    this.effectEmergePosition.top,
					left:   this.effectEmergePosition.left
				} );

				( function a( element, effect ) {
					setTimeout( function b() {
						var distance = parseInt( data.distance, 10 ) || 0;

						$( element ).addClass( effect.name );

						// Create ghost element as a placeholder
						$( element.effectEmergeGhostElement ).css( "visibility", "hidden" );
						$( element ).after( element.effectEmergeGhostElement );

						effect.units = $.inArray( data.units, [ "%", "px" ] ) >= 0 ?
							data.units : "px";

						if( "%" === effect.units ) {
							effect.width = element.effectEmergeWidth * ( 1 + distance / 100 );
							effect.height = element.effectEmergeHeight * ( 1 + distance / 100 );
							element.shiftTop = element.effectEmergeHeight * distance / 130;
							element.shiftLeft = element.effectEmergeWidth * distance / 130;
							effect.top = element.effectEmergePosition.top - element.shiftTop;
							effect.left = element.effectEmergePosition.left - element.shiftLeft;
							effect.shadow = Math.min(
								50,
								Math.min( element.shiftTop, element.shiftLeft )
							) + "px";

						} else {
							effect.width = element.effectEmergeWidth + distance;
							effect.height = element.effectEmergeHeight + distance;
							element.shiftTop = distance / 2;
							element.shiftLeft = distance / 2;
							effect.top = distance / 2;
							effect.left = distance / 2;
							effect.shadow = distance / 2 + "px";
						}

						effect.dispersion = "5px";

						$( element ).css( {
							top:       effect.top,
							left:      effect.left,
							height:    effect.height,
							width:     effect.width,
							boxShadow: effect.shadow + " " + effect.shadow + " " +
								effect.dispersion + " #000"
						} );

					}, 0 );

				} )( this, data );
				break;
			default :
				console.error( "Unknown effect name: '" + data.name + "'" );
				break;
			}

			this.activeEffects.push( data.name );
		} );

		return this;
	};

	/**
	 * Removes effect from the element
	 * @param {string} name Effect name
	 * @param {boolean} stop Flag whether to stop effect immediately
	 * @returns {object} Object/object set on which method was called
	 */
	$.fn.effectOff = function effectOn( name, stop ) {

		$.each( this, function effectsIterator() {

			var
				$this = $( this ),

				// Effect end callback
				effectEnd = null;

			// Effect wasn't applied on the element
			if ( !this.activeEffects || $.inArray( name, this.activeEffects ) === -1 ) {

				return;
			}

			switch( name ) {
			case "emerge" :
				this.style.width = this.effectEmergeWidth + "px";
				this.style.height = this.effectEmergeHeight + "px";
				this.style.top = parseInt( this.style.top, 10 ) +
					parseInt( $this.css( "border-width" ), 10 ) + this.shiftTop + "px";
				this.style.left = parseInt( this.style.left, 10 ) +
					this.shiftLeft + parseInt( $this.css( "border-width" ), 10 ) + "px";

				this.style.boxShadow = this.effectEmergeShadow;

				effectEnd = ( function ee( effectName ) {
					return function ee1() {
						$( this )
							.removeClass( effectName )
							.parent()
							.css( "position", this.effectEmergeParentPosition );

						$( this.effectEmergeGhostElement ).remove();

						this.style.top = this.effectEmergeTop;
						this.style.left = this.effectEmergeLeft;
					};
				} )( name );
				break;
			default :
				console.error( "Unknown effect name: '" + data.name + "'" );
				break;
			}

			if ( stop ) {
				done.call( this, effectEnd, name );
			} else {
				( function a( element, effect ) {

					// Fall back option
					var timeout = setTimeout( function b() {
						done.call( element, effectEnd, effect );
					}, 2000 );

					$( element ).one(
						"transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
						function te() {
							clearTimeout( timeout );
							done.call( element, effectEnd, effect );
						} );

				} )( this, name );
			}

			/**
			 * Effect end callback
			 * @param {function} callback Effect end callback
			 * @param {string} effectName Effect name
			 * @returns {void}
			 */
			function done( callback, effectName ) {
				if( typeof callback === "function" ) {
					callback.call( this );
				}

				// Remove effect from the list of active effects
				if( this.activeEffects.indexOf( effectName ) >= 0 ) {
					this.activeEffects.splice( this.activeEffects.indexOf( effectName ), 1 );
				}
			}

		} );

		return this;
	};

	/**
	 * Animate.css wrapper
	 */
	$.fn.extend( {
		animateCss: function animateCss( animationName, callback ) {
			var
				$this = $( this ),
				cb = function ecb() {
					$this.removeClass( "animated " + animationName );

					if ( typeof callback === "function" ) {
						callback();
					}
				};

			$this
				.removeClass( "animated " + animationName )
				.addClass( "animated " + animationName );

			if ( false && isAnimationEnd ) { // Browser can fire events for several elements
				$this.one( animationEnd, cb );

			} else {
				setTimeout( cb, 1000 );
			}

			return this;
		}
	} );

	/**
	 * Adds notification to notification area
	 * @param {(element|jQuery|object|string)} data Notification data|name
	 * @param {integer} timeout Time to display the notification, optional
	 * @param {string} level Notification level, optional
	 * @returns {function} Remove notification callback
	 */
	ADK.Notification = function n() {
		var
			container = null,
			hourGlassSteps = [
				"fa-hourglass-start",
				"fa-hourglass-half",
				"fa-hourglass-end",
				"fa-hourglass-end fa-rotate-180",
				"fa-hourglass-half fa-rotate-180",
				"fa-hourglass-start fa-rotate-180"
			];

		container = $( "#adk-notification-container" );

		// Create notifications holder
		if ( !container.length ) {
			container = $(
				"<div id='adk-notification-container' class='adk-notification-container'></div>"
			);

			$( document.body ).append( container );
		}

		/**
		 * Adds new slot to notifications holder
		 * @param {element} item Notification element to be put into the slot
		 * @param {int} timeout Time to show notification
		 * @returns {function} Remove slot function
		 */
		function addSlot( item, timeout ) {
			var
				slot = document.createElement( "div" ),
				$slot = $( slot );

			slot.className = "adk-notification-slot";

			$slot.append( $( item ) );
			container.append( $slot );

			$slot.one( "click", removeSlot.bind( slot ) );

			// Notification has expiration time
			if( -1 !== timeout ) {
				$slot.timeout = setTimeout(
					removeSlot.bind( slot ),
					timeout || 5000
				);
			}

			$slot[ 0 ].item = item;
			$slot.animateCss( "bounceIn" );

			return slot;
		}

		/**
		 * Removes notification slot
		 * @returns {void}
		 */
		function removeSlot() {
			var $this = $( this );

			if( this.timeout ) {
				clearTimeout( this.timeout );
			}

			$this.animateCss( "bounceOut", function cb() {
				$this.remove();
			} );
		}

		/**
		 * Runs animation, which consists of list of classes
		 * @returns {void}
		 */
		function runAnimation() {

			var $this = $( this );

			if( this.animation[ this.currentAnimation % this.animation.length ] ) {
				$this
					.removeClass(
						this.animation[ this.currentAnimation % this.animation.length ]
					);
			}

			$this
				.addClass(
					this.animation[ ++this.currentAnimation % this.animation.length ]
				);

			this.timeout = setTimeout( runAnimation.bind( this ), 750 );
		}

		/**
		 * Shows hour glass widget
		 * @returns {function} Remove widget callback
		 */
		this.hourglass = function h() {
			var item = document.createElement( "i" );

			item.className = "notification-hourglass fa";
			item.animation = hourGlassSteps;
			item.currentAnimation = -1;

			runAnimation.call( item );

			return removeSlot.bind( addSlot( item, -1 ) );
		};

		/**
		 * Shows alert message
		 * @param {string} msg Message text
		 * @param {int} timeout Time to showing message
		 * @returns {void}
		 */
		this.alert = function a( msg, timeout ) {
			var $item = $(
				"<div class='notification-alert notification-body'>" +
					"<div class='notification-alert-wrapper'>" +
						"<div class='notification-icon-wrapper notification-alert-icon-wrapper'>" +
							"<i class='fa fa-warning notification-icon " +
							"notification-alert-message-icon'></i>" +
						"</div>" +
						"<div class='notification-text-wrapper notification-alert-text-wrapper'>" +
							"<i class='notification-alert-message-text'>" +
								( msg || "" ) +
							"</i>" +
						"</div>" +
					"</div>" +
				"</div>"
			);

			return removeSlot.bind( addSlot( $item[ 0 ], timeout || 10000 ) );
		};

		/**
		 * Shows notification message
		 * @param {string} msg Notification text
		 * @param {int} timeout Time to show notification
		 * @returns {void}
		 */
		this.notification = function m( msg, timeout ) {
			var $item = $(
				"<div class='notification-info notification-body'>" +
					"<div class='notification-alert-wrapper'>" +
						"<div class='notification-icon-wrapper notification-info-icon-wrapper'>" +
							"<i class='fa fa-info notification-icon " +
							"notification-info-message-icon'></i>" +
						"</div>" +
						"<div class='notification-text-wrapper notification-info-text-wrapper'>" +
							"<i class='notification-info-message-text'>" +
								( msg || "" ) +
							"</i>" +
						"</div>" +
					"</div>" +
				"</div>"
			);

			return removeSlot.bind( addSlot( $item[ 0 ], timeout || 5000 ) );
		};

		/**
		 * Shows notification message
		 * @param {string} msg Notification text
		 * @param {int} timeout Time to show notification
		 * @returns {void}
		 */
		this.progress = function m( progress, msg ) {
			var $item = $(
				"<div class='notification-progress notification-body'>" +
					"<div class='notification-text-wrapper notification-progress-wrapper'>" +
						"<div class=\"progress\" style=\"width: 100%; margin: 0;\">" +
  							"<div class=\"progress-bar progress-bar-striped active progress-bar-warning\" style=\"width: 45%\">" +
								"<span class=\"msg\" style=\"color: black\">" + msg || "" + "</span>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>"
			);

			$item.progress = function( p, msg ) {
				p = p || 0;
				this.find( ".progress-bar" ).css( "width", p + "%" );

				if ( msg ) {
					this.find( ".msg" ).html( msg );
				}

				if ( p >= 100 ) {
					this.close();
				}

				return this;
			};

			$item.close = function() {
				removeSlot.call( this[ 0 ] );
			};

			addSlot( $item[ 0 ], -1 );
			$item.progress( progress );

			return $item;
		};
	};

	/**
	 * Loads elements (scripts, images, iFrames, styles)
	 * @param {string} type Element type
	 * @param {string} src Element URL
	 * @param {boolean} async Asynchronous load flag, optional
	 * @returns {promise} Promise object
	 */
	$.fn.loadElement = function load( type, src, async ) {
		var
			deferred = $.Deferred(),
			el = null,
			l = function() {
				console.log( "Element loaded" );
				deferred.resolveWith( this );
			},
			// Chrome doesn't trigger onload event on iFrames
			types = [ "script", "img", "style", "iframe" ];

			console.log( "Loading " + type );

		try {
			if( typeof type !== "string" ) {
				console.error( "Load element: element name shall be a string" );
				deferred.reject();
				throw "Error";
			}

			if( $.inArray( type, types ) === -1 ) {
				console.error( "Load element: unsupported element: " + type );
				deferred.reject();
				throw "Error";
			}

			if( typeof src !== "string" || !src ) {
				console.error( "Load element: element source shall be a non-empty string" );
				deferred.reject();
				throw "Error";
			}

			el = document.createElement( type );

			if ( el.addEventListener ) {  
				el.addEventListener( "load", l, false ); 
				console.log( "Event: Load" );

			} else  if ( el.attachEvent ) {  
				el.attachEvent( "onload", l ); 
				console.log( "Event: OnLoad" );

			} else  if ( el.onLoad ) { 
				el.onload = l; 
				console.log( "Method: Load" );
			} 

			// el.onload = function done() {
			// 	//this.onreadystatechange = null;
			// 	deferred.resolveWith( this );
			// };

			el.onerror = function fail() {
				deferred.rejectWith( this );
			};

			// el.onreadystatechange = function orsc() {
			// 	if ( this.readyState === "complete" || this.readyState === "loaded") {
			// 		this.onload();
			// 	}
			// };

			if( typeof async === "boolean" ) {
				el.async = async;
				console.log( "Async load: " + async );
			}

			switch( type.toLowerCase() ) {
			case "style" :
				el.href = src;
				break;
			default :
				el.src = src;
				break;
			}

			this[ 0 ].appendChild( el );

		} catch ( e ) {

		}

		return deferred.promise();
	};

	/**
	 * Formats value in bytes to kB, MB etc
	 * @param {integer} bytes Value i bytes
	 * @returns {string} Formatted string
	 */
	ADK.convertBytes = function cb( bytes ) {
		var
			points = 2,
			pow = null,
			value = parseInt( bytes, 10 );

		if ( isNaN( value ) || value <= 0 ) {
			value = 0;
			pow = 0;

		} else {
			pow = Math.floor( Math.log10( value ) / 3 );
		}

		if( pow > 0 ) {
			value /= Math.pow( 10, pow * 3 );
		}

		return ADK.round( value, points ) + " " + [ "B", "kB", "MB", "GB" ][ pow ];
	};

	/**
	 * Rounds number to some fixed points
	 * @param {numeric} value Number to round
	 * @param {int} to Number of points to round to, optional
	 * @param {boolean} pad Flag which shows whether to pad points after dot to needed number
	 * @returns {numeric} Rounded number
	 */
	ADK.round = function r( value, to, pad ) {
		var val = typeof value === "number" ? value : Number( value );

		if( !isFinite( val ) ) {
			return 0;
		}

		if( !pad && val % 1 === 0 ) {
			return val;
		}

		val = val.toFixed( to || 0 );

		if ( pad ) {
			return val;
		}

		return parseFloat( val );
	};

	/**
	 * Returns mySQL formatted DATETIME string from Date object
	 * @param {object} date Date object
	 * @returns {string} Formatted string
	 */
	ADK.sqlTimeStr = function qts( date ) {
		var
			day = null,
			hours = null,
			minutes = null,
			month = null,
			seconds = null;

		if ( !date instanceof Date ) {
			date = new Date();
		}

		month = date.getMonth() + 1;
		day = date.getDate();
		hours = date.getHours();
		minutes = date.getMinutes();
		seconds = date.getSeconds();

		return date.getFullYear() +
				"-" +
				( month < 10 ? "0" + month : month ) +
				"-" +
			( day < 10 ? "0" + day : day ) +
				" " +
			( hours < 10 ? "0" + hours : hours ) +
				":" +
			( minutes < 10 ? "0" + minutes : minutes ) +
				":" +
			( seconds < 10 ? "0" + seconds : seconds );
	};

	/**
	 * Decodes HTML entities inti symbols
	 * @param {string} str Input string
	 * @returns {string} Output string
	 */
	ADK.htmlSpecialcharsDecode = function hd( str ) {

		var symb = {
			amp:    "&",
			quot:   '"',
			apos:   "'",
			"#039": "'",
			lt:     "<",
			gt:     ">"
		};

		if ( typeof str !== "string" ) {
			console.error( "htmlSpecialcharsDecode expects argument to be a string. " +
				typeof str + " given" );

			return "";
		}

		return str.replace( /&([^&;]+);/gim, function seatchSpChars( match, repl ) {
			var ret = match;

			if ( symb[ repl ] ) {
				ret = symb[ repl ];
			}

			return ret;
		} );
	};

	/**
	 * Encodes HTML entities inti symbols
	 * @param {string} str Input string
	 * @returns {string} Output string
	 */
	ADK.htmlSpecialcharsEncode = function hd( str ) {
		var symb = {
			"&": "amp",
			'"': "quot",
			"'": "apos",
			"<": "lt",
			">": "gt"
		};

		if ( typeof str !== "string" ) {
			console.error( "htmlSpecialcharsDecode expects argument to be a string. " +
				typeof str + " given" );

			return "";
		}

		return str.replace( /[&"'<>]/gm, function searchSpChars( match ) {
			var ret = match;

			if ( symb[ match ] ) {
				ret = "&" + symb[ match ] + ";";
			}

			return ret;
		} );
	};

	/**
	 * Make element scroll with the view
	 * @param {object} options Options
	 *    parent - parent element to which bounds element is confined
	 * @returns {void}
	 */
	$.fn.fix = function fix( options ) {
		var
			fixed = [],
			handler = false,
			scrollTop = window.scrollY;

		if ( typeof options.parent === "undefined" ) {
			console.error( "Parent element is missing" );

			return null;
		}

		$.each( this, function eachFix() {
			var data = {};

			data.element = this;
			data.$element = $( this );
			data.parent = options.parent;
			data.$parent = $( options.parent );

			getDimensions( data );

			fixed.push( data );
		} );

		/**
		 * Watches for changes
		 * @returns {void}
		 */
		function watch() {
			var
				i = 0,
				len = 0;

			scrollTop = window.scrollY;

			for( len = fixed.length; i < len; i++ ) {
				getDimensions( fixed[ i ] );
				control( fixed[ i ] );
			}
		}

		/**
		 * Gets needed dimensions
		 * @param {object} data Data
		 * @returns {void}
		 */
		function getDimensions( data ) {

			if ( !data.fixedTop && !data.fixedBottom ) {
				data.elementTop = data.$element.offset().top;
				data.elementHeight = data.$element.outerHeight();
				data.eleemntBottom = data.elementTop + data.elementHeight;
			}

			data.parentTop = data.$parent.offset().top;
			data.parentHeight = data.$parent.innerHeight();
			data.parentBottom = data.parentTop + data.parentHeight;
		}

		/**
		 * Controls element position
		 * @param {object} data Data
		 * @returns {void}
		 */
		function control( data ) {
			if ( !data.$element.is( ":visible" ) ) {
				return;
			}

			// Ignore
			if ( data.parentBottom === data.eleemntBottom ) {
				return;
			}

			// Initial position
			if ( !data.fixedTop && !data.fixedBottom ) {
				if ( scrollTop >= data.elementTop ) {
					fixTop( data );
				}

			// Fixed to the top
			} else if ( data.fixedTop ) {
				if ( scrollTop < data.elementTop ) {
					aFix( data );
				}

				if ( data.parentBottom <= scrollTop + data.elementHeight ) {
					fixBottom( data );
				}

			// Fixed to the bottom
			} else if ( data.parentBottom > scrollTop + data.elementHeight ) {
				fixTop( data );
			}
		}

		/**
		 * Fixes element to the top bound
		 * @param {object} data Data
		 * @returns {void}
		 */
		function fixTop( data ) {
			aFix( data );
			data.fixedTop = true;
			data.$element.addClass( "fixed-top" );
		}

		/**
		 * Fixes element to the bottom bound
		 * @param {object} data Data
		 * @returns {void}
		 */
		function fixBottom( data ) {
			aFix( data );
			data.fixedBottom = true;
			data.$element.addClass( "fixed-bottom" );
			data.$element.css( "bottom", data.eleemntBottom - data.parentBottom );
		}

		/**
		 * Unfixes the element
		 * @param {object} data Data
		 * @returns {void}
		 */
		function aFix( data ) {
			data.fixedTop = false;
			data.fixedBottom = false;
			data.$element.removeClass( "fixed-top fixed-bottom" );
		}

		if ( !handler ) {
			handler = true;
			$( document ).on( "scroll", watch );
		}

		return this;
	};

	// Active button status functionality
	$.fn.btnActive = function btnAtct() {
		$.each( this, function eachButton() {
			var $this = $( this );

			if ( $this.attr( "data-i" ) ) {
				$this.attr( "disabled", "disabled" )
					.find( "i.fa" )
					.removeClass( $this.attr( "data-i" ) )
					.addClass( "fa-spin fa-refresh" );
			}
		} );
	};

	// Reset ti initial state button functionality
	$.fn.btnReset = function btnRes() {
		$.each( this, function eachButton() {
			var $this = $( this );

			if ( $this.attr( "data-i" ) ) {
				$this.removeAttr( "disabled" )
					.find( "i.fa" )
					.removeClass( "fa-spin fa-refresh" )
					.addClass( $this.attr( "data-i" ) );
			}
		} );
	};

	// Gets form's data to POST it
	$.fn.getFormData = function fg() {
		var data = {};

		this.eq( 0 ).find( "[name]" )
			.each( function eachFormData() {
				var
					current = null,
					i = 0,
					len = 0,
					name = "",
					val = $( this ).val(),
					x = 0;

				if ( !this.name || null === val ) {
					return;
				}

				// Array
				if ( this.name.indexOf( "]" ) >= 0 ) {
					name = this.name.replace( /]/g, "" );
					name = name.split( "[" );
					current = data;

					for( i, len = name.length; i < len; i++ ) {
						if ( "" === name[ i ] ) {
							if ( i + 1 !== len ) {
								console.error( "Invalid name attribute: " + this.name );

								return;
							}

							// Not a scalar
							if ( typeof val === "object" ) {
								if ( null === val ) {
									ADK.pushToObject( current, "null" );

								} else if ( val.length ) {
									for ( x = 0; x < val.length; x++ ) {
										current[ x ] = val[ x ];
									}

								} else {
									ADK.pushToObject( current, val.toString() );
								}

								break;

							} else {
								ADK.pushToObject( current, val );
							}

						} else if ( i + 1 === len ) {
							current[ name[ i ] ] = val;

						} else {
							if ( !( name[ i ] in current ) ) {
								current[ name[ i ] ] = {};
							}

							current = current[ name[ i ] ];
						}
					}

				} else if ( !( this.name in data ) ) {
					data[ this.name ] = val;
				}
			} );

		return data;
	};

	ADK.pushToObject = function pto( obj, val ) {
		var
			i = null,
			m = NaN;

		for( i = 0; i < 1000; i++ ) {
			if ( !( i in obj ) ) {
				m = i;
				break;
			}
		}

		if ( isNaN( m ) ) {
			console.error( "Failed to find empty slot for object: ", obj );

			return;
		}

		obj[ m ] = val;
	};

	/**
	 * Checks whether user's agent is running on mobile
	 * @return {boolean} True if mobile
	 */
	ADK.isMobile = function im() {
		return ( /android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i )
			.test( navigator.userAgent );
	};

	/**
	 * Detects if user agent is Apple
	 * @returns {boolean} True if Apple
	 */
	ADK.isApple = function ia() {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	};

	$.fn.scrollTo = function st( data ) {
		var
			animationStep = 10,
			duration = 1000;

		data = data || {};

		$.each( this, function e() {
			var
				dist = 0,
				startPos = 0,
				stepCount = 0,
				totalSteps = 0;

			startPos = $( document ).scrollTop();
			dist = $( this ).position().top - startPos;
			stepCount = totalSteps = Math.ceil( duration / animationStep );

			this.scrollAnimation = {
				startPos:   startPos,
				dist:       dist,
				stepCount:  stepCount,
				totalSteps: totalSteps
			};

			switch( data.animation ) {
			case "ease":
				break;
			default:
				this.scrollAnimation.b = {
					p0: 0,
					p1: 0.5,
					p2: 0.5,
					p3: 1
				};
				break;
			}

			scroll.call( this );

			// Scroll to the first matched element only
			return false;
		} );

		/**
		 * Animates scroll
		 * @returns {void}
		 */
		function scroll() {
			var nextPos = this.scrollAnimation.startPos +
				this.scrollAnimation.dist * bezier.call( this );

			window.scrollTo( 0, nextPos );
			this.scrollAnimation.stepCount--;

			if ( this.scrollAnimation.stepCount >= 0 ) {
				setTimeout( scroll.bind( this ), animationStep );
			}
		}

		/**
		 * Bezier curve
		 * @returns {float} coefficient
		 */
		function bezier() {
			var
				p0 = this.scrollAnimation.b.p0,
				p1 = this.scrollAnimation.b.p1,
				p2 = this.scrollAnimation.b.p2,
				p3 = this.scrollAnimation.b.p3,
				t = ( this.scrollAnimation.totalSteps - this.scrollAnimation.stepCount ) /
					this.scrollAnimation.totalSteps;

			return Math.pow( 1 - t, 3 ) * p0 +
				3 * Math.pow( 1 - t, 2 ) * t * p1 +
				3 * ( 1 - t ) * Math.pow( t, 2 ) * p2 +
				Math.pow( t, 3 ) * p3;
		}
	};

	ADK.checkResponse = function cr( resp ) {
		var r = null;

		if( ADK.isSessionexpired( resp ) ) {
			ADK.alert( ADK.locale.sessionExpired );

		} else {
			r = ADK.sanitizeAjaxResponse( resp );

			if ( null === r ) {
				ADK.n.alert( ADK.locale.parseError );
			}
		}

		return r;
	};

	ADK.progress = function progress( url, data ) {
		var
			deff = new $.Deferred(),
			doneCb = null,
			failCb = null;

		doneCb = function cb( respStr ) {
			var resp = null;

			if( ADK.isSessionexpired( resp ) ) {
				ADK.alert( adkLocale.sessionExpired );

				return;
			}

			if ( respStr ) {
				resp = ADK.checkResponse( respStr );

				if ( resp.progress ) {
					deff.notify( resp.progress, resp.message || "" );
				}

				if ( null !== resp && resp.more && resp.offset ) {
					request( url, $.extend( data, resp ), doneCb, failCb );

					return;
				}
			}

			deff.resolve( respStr );
		};

		failCb = function cb( resp ) {
			deff.reject( resp );
		};

		request( url, data, doneCb, failCb );

		return deff;
	};

	/**
	 * Sends request to some URL
	 * @param {string} url URL
	 * @param {object} data Data to se sent
	 * @param {function} doneCb Done callback
	 * @param {function} failCb Fail callback
	 * @returns {void}
	 */
	function request( url, data, doneCb, failCb ) {
		$.post( url.replace( /&amp;/g, "&" ), data )
			.done( doneCb )
			.fail( failCb );
	}

	/**
	 * Initializes select2 element
	 * @param {array} set of elements to be initialized
	 * @param {object} data Initial data
	 * @param {boolean} force Flag to reinitialize already initialized element
	 * @returns {void}
	 */
	ADK.initSelect2 = function initSelect2( set, data, force ) {
		$.each( $( set ), function each() {
			var
				d = {},
				me = null,
				imageHeight = data && data.imageHeight ? data.imageHeight : 50;

			// Autocomplete
			if ( !this.selectInit || force ) {
				me = $( this );

				if ( me.attr( "data-autocomplete" ) ) {
					d.ajax = {
						url: function url() {
							return me.attr( "data-autocomplete" ).replace( /&amp;/, "&" );
						},
						dataType: "json",
						delay:    250,
						data:     function dFunc( params ) {
							var
								filter = null,
								ret = {};

							filter = me.attr( "data-filter" ) || "filter_name";
							ret.page = params.page;
							ret[ filter ] = params.term;

							return ret;
						},
						processResults: function pR( data, params ) {
							var
								id = me.attr( "data-id" ) || "id",
								ret = { results: [] },
								text = me.attr( "data-text" ) || "name";

							params.page = params.page || 1;
							ret.pagination = {
								more: params.page * 30 < data.total_count
							};

							$.each( data, function eachFunc() {
								var item = null;

								if ( this[ id ] && this[ text ] ) {
									item = { id: this[ id ], text: this[ text ] };

									if ( this.image ) {
										item.image = this.image;
									}

									ret.results.push( item );
								}
							} );

							return ret;
						},
						cache: true
					};

					d.minimumInputLength = 1;
				}

				d.escapeMarkup = function escM(markup) {
					return markup;
				};

				d.templateResult = function formatReponce( data, element ) {
					var
						ret = $( element );

					if( data.image ) {
						ret.html( "<img src='" + ADK.locale.imageBase + data.image +
								"' style='height:" + imageHeight + "px' />&nbsp;" + data.text );
					} else {
						ret.text( data.text );
					}

					ret.attr( "value", data.id );

					return ret;
				};

				d.templateSelection = function formatRepoSelection( data ) {
					if( data.image ) {
						return $( "<span><img src='" + ADK.locale.imageBase + data.image +
								"' style='height:" + imageHeight + "px' />&nbsp;" + data.text + '</span>' );
					} else {
						return $( "<span>" + data.text + "</span>" );
					}
				};

				d.width = "100%";

				me.select2( $.extend( d, data || {} ) );
				this.selectInit = true;
			}
		} );
	};

	$.fn.buttonClick = function buttonClick( cb, data, pd ) {
		var
			$this = $(this ),
			url = $this.attr( "data-url" ),
			d = $.Deferred(),
			post,
			success,
			processData;

		post = typeof cb === "function" ? data : cb;
		success = typeof cb === "function" ? cb : null;
		processData = typeof pd === "undefined" ? true : pd;

		if ( !url ) {
			console.error( "URL is empty" );

			return;
		}

		$this.btnActive();

		$.ajax( {
			url: url.replace( /&amp;/g, "&" ),
			data: post || {},
			type: "POST",
			processData: processData
		} )

			.always( function vcAll() {
				$this.btnReset();
			} )

			.done( function bcDone( respStr ) {
				var resp = null;

				// If response is empty or doesn't contain JSON string
				if ( respStr ) {
					resp = ADK.checkResponse( respStr );

					if ( null === resp ) {
						d.reject( respStr );

					} else {
						if ( success ) {
							success.call($this, resp);
						}

						d.resolve( resp );
					}

				} else {
					d.reject();
					ADK.n.alert( ADK.locale.serverError );
				}
			} )

			.fail( function bcFail( resp ) {
				ADK.n.alert( ADK.locale.networkError );
				d.reject( resp );
			} );

		return d;
	};

	/*
	 * Shorthand for sending data over POST
	 * @param {object} data
	 * @param {function} cd Callback on successful response
	 * @returns {void}
	 */
	ADK.post = function post( data, cb ) {
		var
			$this = $(this );

		$this.btnActive();

		$.post( $this.attr( "data-url" ).replace( /&amp;/g, "&" ), data )
			.always( function pAlways() {
				$this.btnReset();
			} )

			.done( function pDone( respStr ) {
				var resp = null;

				// If response is empty or doesn't contain JSON string
				if ( respStr ) {
					resp = ADK.checkResponse( respStr );

					if ( null === resp ) {
						return;
					}

					cb.call( $this, resp );

				} else {
					ADK.n.alert( ADK.locale.serverError );
				}
			} )

			.fail( function pFail() {
				ADK.n.alert( ADK.locale.networkError );
			} );
	};

	// ************************ Pop-over functionality ****************************/

	// Popover element press event
	$( document ).delegate( ".popover-icon", "mousedown", function press() {
		$( this )
			.removeClass( "released" )
			.addClass( "pressed" );
	} );

	// Popover element release event
	$( document ).delegate( ".popover-icon", "mouseup", function release() {
		$( this )
			.removeClass( "pressed" )
			.addClass( "released" );
	} );

	// Pop over hint
	$( document ).delegate( ".popover-icon", "click", function popover() {

		if( true !== this.popovered ) {
			this.popovered = true;
			$( this ).popover()
				.trigger( "click" );
		}

	} );

	// ***************** Copy to clipboard functionality **********************/

	// Copy to clipboard
	$( document ).delegate( ".clipboard", "click", function copy() {

		if ( "select" in this && "getSelection" in window ) {
			this.select();

			if ( "" === window.getSelection().toString() ) {
				return;
			}

			if( "execCommand" in document && document.execCommand( "copy" ) ) {
				ADK.n.notification(
					ADK.locale.clipboard ||
					"Data have been copied into clipboard"
				);
			}
		}
	} );

	// ********************* Sway ables initialization ************************/

	// Make icons sway
	$( document ).delegate( ".sway-able", "mouseenter", function onHover() {
		$( this ).find( "i" )
			.animateCss( "flip" );
	} );

	// Detect placeholder's visibility
	$( document ).delegate( ".placeholdered", "input init", function init() {
		if ( this.value ) {
			$( this ).removeClass( "placeholder-shown" );

		} else {
			$( this ).addClass( "placeholder-shown" );
		}
	} );

	// Framework specific error object
	ADK.error = function e( message, data ) {
		var r = new Error( message );

		r.data = data;

		r.getLine = function getL() {
			if ( !this.line ) {
				this.process();
			}

			return this.line;
		};

		r.getColumn = function detC() {
			if ( !this.column ) {
				this.process();
			}

			return this.column;
		};

		r.process = function process() {
			var
				ret = "",
				lines = [],
				match = [],
				count = 0;

			if ( this.stack ) {
				lines = this.stack.split( /\r?\n/ );

				if ( lines ) {
					for( var i = 0; i < lines.length && count < 2; i++ ) {
						match = lines[ i ].match( /(\d+):(\d+)[^:]*?$/ );

						if ( match && count === 1 ) {
							if ( match[ 1 ] && match[ 2 ] ) {
								this.line = match[ 1 ];
								this.column = match[ 2 ];
							}
						}

						if ( match ) count++; 
					}
				}
			}
		};

		r.toString = function toS() {
			var s = this.message;

			if ( this.getLine() ) {
				s += " " + this.getLine();
			}

			if ( this.getColumn() ) {
				s += ":" + this.getColumn() 
			}

			return s;
		};

		r.isCustom = true;

		return r;
	};

	// ******************** Tables functionality ******************************/

	function tablePaginate() {
		var
			table = $( this ).closest( ".adk-table" ),
			sortHeader = table.find( "th.active" ),
			sort = '',
			order = '';

		if ( sortHeader.length ) {
			sort = sortHeader.attr( "data-sort" );
			order = sortHeader.attr( "data-order" );
		}

		showOverlay( table );
		
		table.load( table.attr( "data-url" ), {
			page:    $( this ).attr( "data-page" ),
			sort:    sort,
			order:   order,
			filters: getTableFilters( table )
		} );
	} 

	function tableSort() {
		var table = $( this ).closest( ".adk-table" );

		showOverlay( table );
		
		table.load( table.attr( "data-url" ), {
			sort:   $( this ).attr( "data-sort" ),
			order:  $( this ).attr( "data-order" ),
			sorted: "1",
		} );
	}

	function tableFilter() {
		var
			table   = $( this ).closest( ".adk-table-wrapper" ).find( ".adk-table" ),
			sortCol = table.find( "th.active" ),
			page    = table.find( ".adk-table-page-button.active" );

		showOverlay( table );
		
		table.load( table.attr( "data-url" ), {
			sort:    sortCol.length === 1 ? sortCol.attr( "data-sort" )  : "",
			order:   sortCol.length === 1 ? sortCol.attr( "data-order" ) : "",
			page:    page.length === 1    ? page.attr( "data-page" )     : 1,
			filters: getTableFilters( table )
		} );
	}

	function showOverlay( table ) { 
		var overlay = table.find( ".adk-table-overlay" );
		overlay.show();
	}

	function getTableFilters( table ) {
		var ret = {};

		table.closest( ".adk-table-wrapper" ).find( ".table-filter, .table-filter input" ).each( function() {
			if ( $( this ).val() ) {
				ret[ $( this ).attr( "data-code" ) ] = $( this ).val();
			}
		} );

		return ret;
	}
	
	function tableRefresh() {
		tableFilter.call( this );
	}

	// **********************Inline translation *******************************/

	function markTranslated( evt ) {
		var item = $( this ).closest( ".adk-translate-item" );
		evt.preventDefault();
		evt.stopPropagation();
		// evt.originalEvent.stopPropagation();
		// evt.originalEvent.stopImmediatePropagation();
		// evt.originalEvent.preventDefault();
		// evt.originalEvent.cancelBubble = true;
		// console.log( evt.originalEvent.cancelBubble );
		$( ".adk-translate-item" ).not( item ).removeClass( "adk-translate-active" );
		item.toggleClass( "adk-translate-active" );

		if ( item.hasClass( "adk-translate-active" ) ) {
			showTranslationForm.call( this );

		} else {
			hideTranslationForm();
		}

		return false;
	}

	function showTranslationForm() {
		var
			form = undefined,
			item = $( this ).closest( ".adk-translate-item" ),
			text = item.find( ".adk-translate-text" ).text();

		$( ".adk-form-translate" ).each( function() {
			if ( !form ) {
				form = $( this );
				form.appendTo( document.body );

			} else {
				$( this ).remove();
			}
		} );

		form.find( ".adk-translate-original" ).val( text );
		form.find( ".adk-translate-new" ).val( "" );
		form.addClass( "adk-form-active" );
	}

	function hideTranslationForm() {
		$( ".adk-form-translate" ).removeClass( "adk-form-active" );
		$( ".adk-translate-item.adk-translate-active" ).removeClass( "adk-translate-active" );
	}

	function translateCopy() {
		$( ".adk-translate-new" ).val( $( ".adk-translate-original" ).val() );
	}

	function translateApply() {
		var
			item = $( ".adk-translate-item.adk-translate-active" ),
			form = $( ".adk-form-translate" ),
			text = form.find( ".adk-translate-new" ).val(),
			language = item.attr( "data-language" ),
			code = item.attr( "data-code" ),
			isCatalog = item.attr( "data-catalog" ) ? "1" : "0";

		$.post( item.attr( "data-url" ), {
			text: text,
			language: language,
			code: code,
			catalog: isCatalog
		}, null, "json" )

		.always( function() {

		} )

		.done( function( ret ) {
			if ( ret.error ) {
				alert( ret.error );
			}

			if ( ret.success ) {
				hideTranslationForm();
				updateTranslatedText( code, text );
			}
		} )

		.fail( function() { alert( 'Network Error' ) } );
	}

	function translateCaption() {
		var
			button = $( this ),
			parent = button.closest( ".adk-translate-control-wrapper" ),
			input = parent.find( ".adk-translate-control-active" );

		button.btnActive();

		$.post( ADK.locale.translateUrl, {
			text:     input.val(),
			language: input.attr( "data-language" ),
			code:     input.attr( "data-code" ),
			catalog:  input.attr( "data-catalog" )
		}, null, "json" )

		.always( function() {
			button.btnReset()
		} )

		.done( function( ret ) {
			if ( ret.error ) {
				alert( ret.error );
			}

			if ( ret.success ) {

			}
		} )
	}

	function updateTranslatedText( code, text ) {
		$( ".adk-translate-item" ).each( function() {
			if ( $( this ).attr( "data-code" ) === code ) {
				$( this ).find( ".adk-translate-text" ).text( text );
			}
		} );
	}

	$.fn.initTranslateControls = function() {
		var set = this;

		// A Change event needs to be triggered on select in order to set active input
		// and set in accordance select and textarea content (when element is placed into tab -
		// click in tab's tag is the best way to handle it)
		ADK.initSelect2( this, { data: ADK.locale.languages, imageHeight: 25 } );
	};

	function changeTranslationSlide() {
		var
			select = $( this ),
			parent = select.closest( ".adk-translate-control-wrapper" ),
			slider = parent.find( ".adk-translate-control-set" ),
			input = parent.find( "#adk-translate-control-input-" + select.val() );

		parent.find( ".adk-translate-control-input" ).removeClass( "adk-translate-control-active" );
		slider.css( "top", input.position().top * -1 );
		input.addClass( "adk-translate-control-active" );

	}
	
	/**
	 * Saves configuration
	 * @returns {undefined}
	 */
	function saveConfig() {
		var
			name = $( this ).attr( "id" ),
			value = $( this ).val(),
			control = $( this ),
			kontrol = this;

		$.post( ADK.locale.settingUrl, { name: name, value: value } )
		.done( function ( resp ) {
			var response = ADK.checkResponse( resp );

			if ( null === response ) {
				if ( kontrol.fancyCheckboxed ) {
					control.fancyCheckbox( 'toggle-view' );
				}

				return;
			}

			if ( kontrol.fancyCheckboxed ) {
				ADK.n.alert( response.error );

				if ( 'fancyCheckbox' in control ) {
					control.fancyCheckbox( 'toggle-view' );
				}

			} else if ( response.success ) {
				ADK.n.notification( response.success );
			}
		} );
	}

	// ******************** On document load stuff ****************************/

	$( document ).ready( function ready() {

		$( ".slider" ).each( function iterateOverSliders() {
			ADK.initSlider( this );
		} );

		// Initialize switchblades
		$( ".switchable" ).each( function iterateOverSwitchables() {
			ADK.initSwitchable( this );
		} );

		// It's not a bug
		$( ".slider" ).each( function iterateOverSliders() {
			ADK.initSlider( this );
		} );

		// Initialize fancy check-boxes
		$( ".fancy-checkbox" ).fancyCheckbox();

		// Initialize Iris'
		$( ".iris" ).each( function e() {
			ADK.initIris( this );
		} );

		ADK.initSelect2( $( ".adk-table-wrapper .well .select2" ) );
		

		$( document ).on( "click", "* > .adk-translate-check", function(e){
			console.log( e.originalEvent.cancelBubble );
			console.log( e.originalEvent.defaultPrevented );
			console.log(e)
		} );

		// **************** Objects instantiations ****************************/

		ADK.n = new ADK.Notification();

		// Check the "end animation" event support
		$( "body" ).one( animationEnd, function cb() {
			isAnimationEnd = true;
			$( "body" ).removeClass( "test-animation" );
		} )
			.addClass( "test-animation" );
	} );

	// Paginate table
	$( document ).delegate( ".adk-table-page-button:not(.active)", "click", tablePaginate );

	//Sort table
	$( document ).delegate( ".adk-table th.sortable", "click", tableSort );
	// Filter table
	$( document ).delegate( ".adk-table-wrapper .well .filter-button", "click", tableFilter );
	$( document ).delegate( ".adk-table", "refresh", tableRefresh );

	$( document ).on( "click", ".adk-translate-button-copy", translateCopy );
	$( document ).on( "click", ".adk-translate-button-apply", translateApply );
	$( document ).on( "click", ".adk-translate-button-close", hideTranslationForm );
	$( document ).on( "change", ".adk-translate-control-select", changeTranslationSlide );
	$( document ).on( "click", ".adk-translate-control-button", translateCaption )
	$( document ).on( "change", ".config-control", saveConfig );

	document.addEventListener( "click", function( e ) {
		if ( e.target.className === "adk-translate-check" ) {
			markTranslated.call( e.target, e );
		}
	}, true );

	// ******************** Objects instantiations ****************************/

	ADK.e = new ADK.Event();
	ADK.processed = true;

} )( jQuery );
