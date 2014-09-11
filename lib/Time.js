/*
	Time is a utility to help synchronise time between clients and servers; for instance, you may have something displayed to
	a user which uses their local system time, but actually you need it to display time in the context of your ecosystem.

	jsutils.Time is a simple class containing various internal properties for calculating a valid time adjustment. This is done
	by creating an instance of jsutils.Time.Adjustment(), then when you have a valid server time (eg, the Date header from
	a server response) you then use the instances serverTime(...) function, passing in a valid date string.

	The created Adjustment will then invalidate itself, ensuring it cannot be reused by accident. You can then use the
	jsutils.Time.Date() method which will return a valid Date object, which is the client time, adjusted by the relevant amount
	to display the server time.

	This can be updated any time by creating another instance of jsutils.Time.Adjustment(), and setting the serverTime(...) again.
*/
var Time = (function(){
	var adjustment, latestServerTime, setLatestServerTime;

	/*
        	Adjustment is a universal property which is updated by creating the above Instance object; this ensures that each instance will 
        	update only this adjustment property, and will not update their internal "private" properties per instance.

        	Default adjustment is zero; ie, no adjustment is required
    	*/
	adjustment = 0;

	// Stores the most recent server time, to ensure the adjustment is only updated using the most recent server response
    	latestServerTime = null;
	setLatestServerTime = function (value) {
            	// Set if latestServerTime is null (and value is a valid date), or latestServerTime is not the most recent time
            	if (!latestServerTime && !isNaN(value) || latestServerTime < value) {
               		latestServerTime = value;
            	}
    	};

	return {
		/*
			Adjuster is a self-invalidating class, when an instance is created, as a single public method serverTime(...) which
			accepts a valid date string. This will then kick off various internal calculations to update an internal 'adjustment'
			property, which is then used by jsutils.Time.Date() to adjust the client Date by the calculated amount.
		*/
		Adjuster: function() {
			var clientStartTime, clientEndTime, adjustedClientTime, _serverTime, serverTime, logClientTimeDiff, updateAdjustment, invalidate;

			// Property used to store the client time when the instance was created
			clientStartTime = Date.now();

            		// Property used to store the client time of when the server time property was updated in this instance
            		clientEndTime = null;

            		// Property to store the adjusted client time, which is the median time between the above two properties
            		adjustedClientTime = null;

            		// Property to store the time from the Date header from AJAX calls to the server
            		_serverTime = null;

            		// When the server time is received from the header, we need to log the client time again to retrieve the correct adjustment
            		logClientTimeDiff = function () {
                		clientEndTime = Date.now();
                		if (clientStartTime) {
                    			/* 
	                       			We need to make a calculation of the actual client time according to the server, since the Date header from the 
        	                		response will be when the server responded, and not when the client sent the request or received the response.
                	    		*/
                    			adjustedClientTime = (clientEndTime - ((clientEndTime - clientStartTime) / 2));
	                	}
        	    	};
            
	            	/*
        	        	Find out how much difference there is between the server time and the client time, and update the adjustment number.
                		Once completed, cleanup the internal properties as they are no longer required.
	            	*/
        	   	updateAdjustment = function () {
                		adjustment = Math.floor(_serverTime - adjustedClientTime);
                		invalidate();
	            	};

	            	/*
        	        	Used to invalidate the instance; once invalidated, the instance is rendered inoperable.
            		*/
	            	invalidate = function () {
        	        	clientStartTime = null;
                		clientEndTime = null;
                		adjustedClientTime = null;
	                	_serverTime = null;
        	    	};
		
	 		/*
                		The only "public" property provided by the instance, allows the creator to update the server time such that this instance
	                	can then correctly update the universal adjustment property.
	
        	        	If the server time provided is invalid, the method will invalidate the whole instance
            		*/
	            	this.serverTime = function (newServerTime) {
        	            	// If clientStartTime is null, assume this instance has been invalidated, and therefore should prevent the server time from being updated
                	    	if (clientStartTime) {
                        		// Update the server time with the value provided (expected to be a valid date string - ie, a response Date header)
                       			_serverTime = (new Date(newServerTime)).getTime();
					setLatestServerTime(_serverTime);
	
                        		// If the server time is valid, and is the most recent server response, attempt to update the adjustment. Otherwise invalidate the instance
        	                	if (!isNaN(_serverTime) && _serverTime === latestServerTime) {
                	            		logClientTimeDiff(); // if the server time is being logged, we should assume that a response has been received, and we should log the client time again for the adjustment calculation
                            			updateAdjustment();
	                        	} else {
        	                    		invalidate();
                	        	}
	                    	}
        	        };
		},

 	   	// Returns a valid Date object, which is adjusted using the internal 'adjustment' property.
    		Date: function () {
        		var date = new Date();
 
	            	date.setTime(date.getTime() + adjustment);
	
        		return date;
	    	}
	}
}());

module.exports = Time;