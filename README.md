#Madbid Chrome extension (proof of concept working with Madbid version 4.0.2158)
This extension is able to analyze Madbid penny auction. It can also automatically bid.

##Madbid ?
[Madbid](http://madbid.com) is a penny auction. It is an all-pay auction in which all participants must pay a fee to place each one penny bid.

##Theory
According to this [thesis](https://cs.brown.edu/research/pubs/theses/ugrad/2012/jstix.pdf), it is possible to build an algorithm to detect auction ending pattern.

##Project
This project is very new and probably will not be maintained. Also, I wrote no test. I just develop a proof of concept algorithm very quickly.

This chrome extension use:
* angularjs 1.3.x
* typescript 1.4
* highcarts 4.x

It has only a panel in developer tools window. This panel contains:
* live auction selector
* active bidder selector
* charts displaying 
  * bids for the selected auction over time
  * bidders for the selected aucton over time
  * bid-time distribution (delay before auction end)
* informations about active bidders. They are classified among following bidder type:
  * aggresive bidder (bid without pausing during short time period)
  * pacing bidder (tend to bid in spurts over longer periods of time, when they think the auction is about to end)
  * sleepy active bidder (was considered as aggresive or pacing once, and recently bid)
* detection of ending pattern: 2 or less active bidders plus following pattern satisfied:
  * A single bid as the auction clock approached zero
  * Several bids (at least one) following that bid within a few seconds
* Auto bid tool (ability to automaticaly bid if timer approach x secondes). This algorithm uses Madbid page Javascript (version 4.0.2158). Also it works today, it maybe won't in 3 months...


Feel free to use and modify.
