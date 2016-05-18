### Chamador de Senhas
-----

Search and remove malicious code from websites based on a small database.

## Preview

![Preview](preview/main.png)

![Preview](preview/complete.png)

![Preview](preview/usage.gif)


## About

People that use wordpress and some websites in general nowadays can face a very serious problem with bad developed plugins, security breach's, shared hosting server with problems and new zero-day exploits.

Server's admin can find some of the websites with malicious code and even the whole server in some cases.

It's quit easy detect this kind of attack and prevent, but the hard work is really get rid off the bad code, some times is just easy reinstall the whole wordpress itself, but ofcourse this is not all the cases.


For this reason I have developed this simple `php script` that will load all the previous `.txt` files stored at the `malicious_code` folder and search in a folder for php files that could contain the malicious code, if it find any occurrence it will remove the malicious code.


## Use
Run from the terminal: `php run.php /folder/to/my/files`

**NOTE** You can set the file extension to be verified as the last parameter
`php run.php /folder/to/my/files php`
