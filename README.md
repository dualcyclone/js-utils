js-utils
========

Just a stuff to store all my JavaScript utilities

## Namespace

A class to create namespaces for classes without needing to hard-code namespaces, eg:

<code>jsutils.Namespace('path.to.name.space', {anything : true});</code>

...Will create the object '<code>path.to.name.space</code>' with the object defined in the method signature.

The class will throw an error if you attempt to create an object with the same namespace as an existing object

<pre>
<code>
	// Will create path.to.name successfully
	jsutils.Namespace('path.to.name', {stuff : true});
	
	// Will create path.to.name.space successfully
	jsutils.Namespace('path.to.name.space', {anything : true});
		
	// Will throw an error
	jsutils.Namespace('path.to.name.space', {anything : true});
</code>
</pre>
