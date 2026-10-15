# The screen follows the address

The router no longer drops an address change that arrives while a route change is running. A link, Back or Forward, or a typed address within the transition (the middleware, the fade out, the render and the fade in) used to move the hash and leave the old screen showing. Route changes now run one at a time: a change made during one is remembered, and once that one is done the router shows the route the address names - unless the address has come back to the screen already shown. Several changes in one transition land on the last. A change made while middleware is still deciding now waits its turn instead of running alongside.

<!-- website -->
<p>The router keeps up with fast navigation: a link, Back or Forward pressed while a screen is still changing now shows the right screen instead of leaving the old one.</p>
