smart-utilities
==============
A collection of utilities to help with creating and using Joyent's Smart platform from someone who came at it just like you, with little knowledge.

smart
-----
A script that you can put into your path (/usr/local/bin or ~/bin) that will automatically create the necessary directory structure for you. The application name must be the same name that you use in the Smart Platform Git repository. If you add a second parameter, it will also add it to GitHub with the same application name and using the second parameter as the GitHub username. Usage:

smart project_name _githubusername_

If you see output like this:

	ERROR:gitosis.serve.main:Repository read access denied
	fatal: The remote end hung up unexpectedly

It means that you have not created your repository with Joyent, go to the [Smart Platform Management - Hosts section](http://smart.joyent.com/hosts) to add one.

If you see output like this:

	Repository not found. If you've just created it, please try again in a few seconds.
	fatal: The remote end hung up unexpectedly
	fatal: remote smart already exists.

It means that you have not created your repository with GitHub, go to the [repository creator](https://github.com/repositories/new).