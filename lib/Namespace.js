var Namespace = (function(){
    'use strict';

    var current, previous, lastName, space,
        generate = function(namespaceKeys, namespaceObj) {
            if (namespaceKeys.length) {
                // Initialise the injection point for the next namespace key; if this hasn't executed yet, then use the window object as the intial injection point
                var pointerObj = (current === null ? window : current);

                // get the next name in the namespace to generate
                lastName = namespaceKeys.shift();

                // if there are no more keys left, and the object with the namespace already exists, throw an error
                if (namespaceKeys.length === 0 && !(typeof pointerObj[lastName] === 'undefined')) {
                    throw 'You have attempted to overwrite an existing object namespace: "' + space + '"';
                }

                // Create the object at the point in the namespace; if this is the last key in the list, assign the configured object to this key.
                current = pointerObj[lastName] = pointerObj[lastName] || (namespaceKeys.length === 0 ? namespaceObj : {});

                // Call myself with the updated key list until there are no more keys to generate
                generate(namespaceKeys, namespaceObj);
            }
        },
        reset = function() {
            current = previous = lastName = space = null;
        };

    return {
        /**
         * Method to initialise an object for a given namespace
         * @param {String} namespace The namespace to generate
         * @param {Object} namespaceObj The object to assign to the newly created namespace
         * @throws error Error is thrown if an attempt is made to overwrite an existing namespace with a new object
         */
        create: function namespaceGenerator(namespace, namespaceObj) {
            // Reset vars
            reset();

            // save the namespace string in case we need to throw an error
            space = namespace;

            // generate the namespace using the object
            generate(namespace.split('.'), namespaceObj);

        }
    };
}());

// exporting the plugin main function
module.exports = Namespace;
