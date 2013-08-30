reddit-ng
=========

![Preview of reddit-ng](/preview.png "Preview reddit ng")

(The Preview shows the same content in main-window and the comment-window. If you have a Image on imgur you will see the image on the left and the reddit-comments on the right. The screenshot just illustrates the general layout. The Buttons for Subreddit, Filter , Next are the main functions. 99% Percent you just use the next-button or the arrow-right key. )

Browse reddit post &amp; comments at same time with next button and subreddit filter

_Tested and Optimized for Google-Chrome_, maybe need some Javascript-Bugfixes in other Browsers. 



Demo is on: 
http://ayurmedia.github.io/reddit-ng/

Make your Browser window 25% on the right side of your desktop.
open http://ayurmedia.github.io/reddit-ng/

If you clone this github-Project it might not work if you call it locally over file:// due to limitations in Ajax and Browser-Security. 

Hosting and loading over a webserver is fine. Technology is angular.js (only html + css +js) no server-side code involved, all static html + client-side storage-api (html5) for saving temp data. (it will stay even if you close the browser-window). 


It will open the Content in a new Browser-Window which will stay there. 
It automatically has the remaining width compared to your last window. 
If you want to resize easily, simply resize the comments-window , closs the content-window and reload the url, it will reopen. 

Due to limitations with iframes it must use another window. 

To make things simple, the comments-window simply loads an iframe with the mobile version of the comments-list. 
The sideeffect here is that some links wont work, like youtube cannot be opened inside iframes. so you have to open links in response-comments in new window (many times middleclick on your mouse ). 
Feel Free to optimize this code. 
There are some Projekts to read the comments as JSON and render it directly, but this way with the iframe is more simple. 
I already load the things-list via JSON from reddit.com, so loading the comments would not be so difficult, but the rendering of the comments (nested also) a bit more. 
As the Project uses Angular.js there are client-side handlebar templates available, so rendering comments could be done. maybe later.

Tipp: in the comments frame you will be displayed the "mobile" version as it fits nice on a small column browser. use the "old one is just fine" version. it will only ask once until you have the cookie for which mobile-version to use. 



For my purpose it works quite good in this setup. 

Advantages to normal reddit: 
============================

* You have filter for subreddits, which you want to exclude (similar to RES)
* There is an internal counter/storage for you visited posts. using local-storage locally in the client (=browser) no data is stored on the server. 
* If you read a post it will not be shown again. You would need to clear the local-storage for the reddig-ng website to read then again, or disable auto-skip. 
* the visited-counter now matches the post-url, as the post-name (reddit id) changes every day. so items you read already would apear again. this way you see it only once, also it automatically filters some reposts to the exact same url. 
* you can go up to 10 pages, (it loads new pages from the frontpage automatically via json) then an "auto-skip" button will apear. if you press it, you can go another 10 Pages. This 10 page limit is also to prevent infinite loops if you have some strange subreddits or filters. 
* you can even go forward with "->" right-arrow key. similar like the next button in imgur. if a page hijacs the focus with javascript:this.focus() then this behavior might brake and you have to press the "next"-button with a mouse-click. 
* Images to imgur are changed so you not only see the image, but the full imgur page with comments there. (i like this behavior better than deeplinks, also then images are automatically resized properly. )

Inpiration for this project was a chromium-plugin to display reddit in the developer-view. it's nice, but i like this project better, as it also shows the comments to a post automatically and i have a next button, and can use the right-arrow-key for forward. 




