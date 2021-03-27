( function() {
	"use strict";

	function closeForm() {
		$( ".adk-form" ).fadeOut();
	}
	
	function showForm() {
		if ( $( this ).hasClass( "adk-edit-data" ) ) {
			window.location.assign( ADK.locale.accountUrl );
			return;
		}

		$( ".adk-form" ).fadeIn().attr( "data-type", $( this ).attr( "data-type" ) );
	}
	
	function sendRequest() {
		var
			email = $( ".adk-form input" ).val(),
			captcha = $( ".adk-form #captcha-wrapper input, .adk-form #captcha-wrapper textarea" ).eq( 0 ),
			data = {};
	
		hideMessage();
		
		if ( !email ) {
			showError( ADK.locale.emptyEmail );
		}

		data = {
			type:  $( this ).closest( ".adk-form" ).attr( "data-type" ),
			email: email
		};

		if ( captcha.length && captcha.attr( "name" ) ) {
			data[ captcha.attr( "name" ) ] = captcha.val();
		}

		$( "#adk-form #captcha-wrapper input")
		
		$( this ).buttonClick( data )

		.always( function() {
			closeForm();
		} )

		.done( function( ret ) {
			if ( ret.error ) {
				showError( ret.error );
			}
			
			if ( ret.success ) {
				showOk( ret.success );
			}
		} );
	}
	
	function showError( message ) {
		$( ".adk-error .adk-message-body" ).html( message );
		$( ".adk-error" ).fadeIn();
		window.scrollTo( { top: $( ".adk-error" ).offset().top - 20, left: 0, behavior: "smooth" } );
	}
	
	function showOk( message ) {
		$( ".adk-ok .adk-message-body" ).html( message );
		$( ".adk-ok" ).fadeIn();
		window.scrollTo( { top: $( ".adk-ok" ).offset().top - 20, left: 0, behavior: "smooth" } );
	}
	
	function hideMessage() {
		$( ".adk-message" ).fadeOut();
	}

	$( document ).ready( function() {
		$( "#adk-cancel" ).on( "click", closeForm );
		$( ".adk-control" ).on( "click", showForm );
		$( "#adk-send" ).on( "click", sendRequest );
	} );
} )( jQuery );