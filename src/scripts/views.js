module.exports = (function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["decorate-bottom.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section dark decorate decorate-bottom">\n	<div class="inner">\n		<p class="f-small">Please ensure your message is correct as you won\'t be able to edit it once shared.</p>\n	</div>\n</div>';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["decorate-top.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section decorate decorate-top color-' +
((__t = ( treecolour )) == null ? '' : __t) +
'">\n	<div class="inner">\n		\n		<textarea name="" cols="30" rows="10" placeholder="write a festive message on the star + hang it on our tree for a friend to find..." class="auto-select decorate-message star-message" class="f-regular"></textarea>\n\n		<div class="g-recaptcha" data-sitekey="' +
((__t = ( captcha_key )) == null ? '' : __t) +
'"></div>\n	\n		<a class="btn btn-progress decorate-form-submit">\n			<img src="/static_assets/img/loader.gif" class="loader" alt="" />\n			<span class="text">Hang your star</span>\n		</a>\n\n		<p class="font-regular">Please double check your message before you hang your star. our tree is made of good wishes + festive spirit. Any messages that could be deemed offensive will be taken down from our branches.</p>\n	</div>\n</div>';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["enter-top.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section enter enter-top">\n	<div class="inner">\n		<h2 class="f-bold">Enter your details</h2>\n		<p class="f-regular">we\'ll be in touch if you + your friend win a year of free wagamama!</p>\n\n		<a class="btn btn-progress enter-facebook-connect">\n			<img src="/static_assets/img/loader.gif" class="loader" alt="" />\n			<span class="text"><span class="icon-facebook"></span> Log in</span>\n		</a>\n\n		<form class="enter-form" novalidate>\n			<div class="row">\n				<input type="text" name="first_name" placeholder="First Name" class="text auto-select">\n				<span class="error">Please enter your first name</span>\n			</div>\n			<div class="row">\n				<input type="text" name="last_name" placeholder="Last Name" class="text">\n				<span class="error">Please enter your last name</span>\n			</div>\n			<div class="row">\n				<input type="email" name="email" placeholder="E-mail address" class="text">\n				<span class="error">Please enter a valid email address</span>\n			</div>\n\n			<div class="row">\n				<a class="btn btn-progress enter-form-submit">\n					<img src="/static_assets/img/loader.gif" class="loader" alt="" />\n					<span class="text">Submit</span>\n				</a>\n			</div>\n		</form>\n	</div>\n</div>';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["error-modal.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section error-modal">\n	<div class="inner">\n		<h2 class="f-bold"><span class="big">' +
((__t = ( title )) == null ? '' : __t) +
'</h2>\n		<p class="f-regular">' +
((__t = ( message )) == null ? '' : __t) +
'</p>	\n		<a class="btn f-bold error-close">' +
((__t = ( button )) == null ? '' : __t) +
'</a>\n	</div>\n</div>\n';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["get-started-modal.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section get-started get-started-modal">\n	<div class="inner">\n		<h2 class="f-bold"><span class="big">#wagamama<span class="f-red">star</span></h2>\n		<p class="f-regular">you\'re about to visit our virtual tree! by entering this site, you\'re agreeing to our <a href="#terms-and-conditions/">terms + conditions</a></p>	\n		<a href="#enter/" class="btn f-bold">take me to the tree</a>\n	</div>\n</div>\n';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["home-bottom.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section dark home home-bottom">\n	<div class="inner">\n		\n		<h2 class="f-bold">Share the #wagamamastar with your friends</h2>\n		<a class="btn f-bold share-site-facebook"><span class="icon-facebook"></span> Share</a>\n		\n	</div>\n</div>';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["home-top.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section home home-top">\n    <div class="inner">\n\n    	<h1 class="f-bold">share your<span class="big">#wagamama<span class="f-red">star</span></span>\n    	be part of the biggest virtual tree made entirely of good wishes! hang a star for your friend + you could both win free wagamama for a year!</h1>\n \n		<p class="f-regular">we\'ll donate <span class="f-bold">£1</span> to <a href="http://ukyouth.org/" target="_blank" class="outbound-link">uk youth</a> for every star added. By entering this site, you\'re agreeing to our <a href="#terms/">terms + conditions</a></p>\n\n		<a href="#enter/" class="btn f-bold">Create your star</a>\n		\n    </div>\n</div>\n';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["share-email-top.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section share-email share-email-top">\n	<div class="inner">\n		<h2 class="f-bold">Share your <span class="big">#wagamama<span class="f-red">star</span></h2>\n		<form class="share-email-form">\n			<div class="row">\n				<input type="text" class="email-share-name" placeholder="Your friend\'s name">\n				<span class="error">Please enter your friend\'s name</span>\n			</div>\n			<div class="row">\n				<input type="email" class="email-share-address" placeholder="Your friend\'s email">\n				<span class="error">Please enter a valid email address</span>\n			</div>\n			<div class="row">\n				<a class="btn btn-progress email-share-button">\n					<img src="/static_assets/img/loader.gif" class="loader" alt="" />\n					<span class="text">Share</span>\n				</a>\n			</div>\n		</form>\n	</div>\n</div>';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["share-facebook-top.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section share-facebook share-facebook-top">\n	<div class="inner">\n		<h2>Share your star on Facebook</h2>\n		<!-- <a class="btn facebook-share-button">Share</a> -->\n		<!-- <a href="/#/thank-you/" class="btn share-facebook-submit">Next step</a> -->\n	</div>\n</div>';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["share-top.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section share share-top">\n	<div class="inner">\n		<form>\n			<p class="f-regular">you\'re now part of the biggest virtual tree made of good wishes!</p>\n			<h2 class="f-bold">Send your friend a link to their #wagamama<span class="f-red">star</span> + you could both win free wagamama for a year!</h2>\n			\n			<div class="share-buttons">\n				<a class="btn share-facebook-link">Facebook</a>\n				<a href="#share/email" class="btn share-email-link">Email</a>\n			</div>\n			\n		</form>\n	</div>\n</div>';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["star-top.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section star star-top color-' +
((__t = ( treecolour )) == null ? '' : __t) +
'">\n	<div class="inner">\n		\n		<h2 class="f-bold view-star-heading">you\'re part of our virtual tree! <span class="f-red">' +
((__t = ( star.first_name )) == null ? '' : __t) +
' ' +
((__t = ( star.last_name )) == null ? '' : __t) +
'</span> has sent you a festive message:</h2>\n	\n		<p class="f-regular star-message">' +
((__t = ( star.message )) == null ? '' : __t) +
'</p>\n\n		<a href="#reset/" class="btn f-bold reset-star">hang a #wagamamastar</a>\n\n	</div>\n</div>';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["terms-top.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section terms terms-top">\n    <div class="inner">\n\n        <h2 class="f-bold">Terms &amp; Conditions</h2>\n\n        <p>#wagamamastar | Terms + Conditions for entrants</p>\n\n        <p>1. The promoter of the \'#wagamamastar\' competition is wagamama Limited, 76 Wardour Street, London W1F 0UR (company number 02605751) ("we", "our").</p>\n\n        <p>2. The Agent acting on behalf of the promoter is Elvis Communications Ltd (company number 04768344) 172 Drury Lane, London, WC2B 5QR.</p> \n\n        <p>3. The promotion is open to UK residents (excluding Northern Ireland) aged 16 or over, other than our employees, their families, our agencies or anyone\n            else associated with the \'#wagamamastar\' campaign ("you", "your", "entrant").</p>\n\n        <p>4. The promotion period is from 10.00 on 1st December 2015 until 23.59 on 23rd December 2015 (inclusive).</p>\n\n        <p>5. A winner will be announced on 1<sup>st</sup> January 2016, the winner will be selected from all valid entries across the promotional period.</p>\n\n        <p>6. The announced winning entries and the Agent\'s decision are final and not subject to any contestation or change.</p>\n\n        <p>7. The winners will be notified via direct messaging (Facebook) or email on 1<sup>st</sup> January 2016.</p>\n\n        <p>8. Entries received after the closing date will not be counted.</p>\n\n        <p>9. Internet access required.</p>\n\n        <p>10. To enter you must:</p>\n\n        <p>&#8226; Create your #wagamamastar by writing your personalised message on the mobile site.</p>\n\n        <p>&#8226; Submit your #wagamamastar message by sending it to your friend via Facebook or email.</p>\n\n        <p>11. Prize: The winner of the \'#wagamamastar\' promotion will receive wagamama for them and a friend for a year to the value of seven hundred and twenty\n            pounds (&#163;720), three hundred and sixty (&#163;360) per person. Each month the winner will receive 2 preloaded gift cards with thirty (&#163;30) pounds\n            on each to spend within one month. The details and specification of the prize are at the discretion of the Agent and Promoter and will not be subject to\n            any contestation or change.</p>\n\n        <p>13. If no response to the notification of being selected as the winner is received within 5 days the Promoter reserves the right to award the prize to an\n            alternative winner and still announce the original winner and use the submitted messages.</p>\n\n        <p>14. The prize will be delivered to the winner each month by post.</p>\n\n        <p>15. The winner\'s message will be uploaded onto our Facebook page: <a href="http://www.facebook.com/wagamama">www.facebook.com/wagamama</a></p>\n\n        <p>16. You can enter the competition multiple times by uploading wagamama stars to our virtual tree. Please be aware that if you upload a message, you are\n            uploading it onto a publicly available site and other users will be able to see your entry.</p>\n        <p>18. Illegible and/or incomplete entries and entries submitted by entrants who do not meet the eligibility requirements are void.</p>\n\n        <p>19. By entering you agree that (i) your name and likeness may be used by us for advertising and publicity purposes, and (ii) your friend\'s name and\n            likeness may be used by us for advertising and publicity purposes and that you have the consent of your friend\'s legal guardian, if the friend is under the\n            age of 16 years, to enter their details as part of this competition.</p>\n\n        <p>20. We comply with the standard procedures laid down in the UK Data Protection Act to ensure that the personal information you give us is kept secure and\n            processed fairly and lawfully. We will not share your information with third parties for marketing purposes. For further details please see our online\n            privacy policy at: <a href="http://www.wagamama.com/policies/privacy-statement">http://www.wagamama.com/policies/privacy-statement</a></p>\n\n        <p>21. You grant to us a non-exclusive, royalty-free, transferable, sub licensable, worldwide license to use, display, reproduce, modify, re-arrange, and\n            distribute any text or materials uploaded by you onto our site for the purposes of determining a winner for the competition, this will also include our use\n            of your entry on Facebook.</p>\n\n        <p>22. You agree that any message you submit does not violate any law or infringe the rights of any third party, including without limitation, any\n            intellectual property rights. Messages that could be deemed offensive in any way will not be accepted and will be removed from the site.</p>\n\n        <p>23. We reserve the right to remove any message that you upload through our website for any reason including any uploads that violate these terms and\n            conditions.</p>\n\n        <p>24. For every entry uploaded, wagamama will donate &#163;1 to UK Youth. This is up to a maximum donation value of ten thousand pounds (&#163;10,000).</p>\n\n        <p>25. We do not accept responsibility for (i) lost entries or network, computer, hardware or software failures of any kind, which may restrict or delay the\n            sending or receipt of your entry, (ii) any postponement or cancellation of the competition, (iii) any loss or, changes to, postponement of or use of the\n            prize, and (iv) any act or default of any third party supplier, which is beyond our reasonable control.</p>\n\n        <p>26. The prize is non transferable, non refundable and non negotiable. There is no cash alternative.</p>\n\n        <p>27. By entering this promotion, you agree to be bound by these terms and that our decision is final and binding in all matters relating to this promotion.</p>\n\n        <p>28. We reserve the right in our sole discretion to (i) alter, amend or close this promotion, without prior notice at any time, (ii) refuse any individual\'s\n            entry, (iii) amend these terms and conditions (and we will use reasonable endeavours to notify changes to entrants and potential entrants) or (iv)\n            disqualify any individual we find to be tampering with the entry process or to be acting in violation of the terms and conditions or in an unsportsmanlike\n            or disruptive manner. Any attempt by any person to undermine the legitimate operation of the competition may be a violation of criminal and civil law.\n            Failure by us to enforce any term of the terms and conditions will not constitute a waiver of that provision.</p>\n\n        <p>29. The winner\'s name will be available by sending a self-addressed envelope to \'#wagamamastar competition\', Elvis Communications, 172 Drury Lane, London, WC2B 5QR.</p>\n\n        <p>30. This promotion is governed by the laws of England and Wales and you submit to the exclusive jurisdiction of the English courts in relation to any dispute arising hereunder.</p>\n\n    </div>\n</div>';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["thank-you-bottom.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section thank-you thank-you-bottom">\n	<div class="inner">\n		<a href="#/" class="btn">Create another</a>\n	</div>\n</div>';

}
return __p
}})();
(function() {
window["WAG"] = window["WAG"] || {};

window["WAG"]["thank-you-top.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="section thank-you thank-you-top">\n	<div class="inner">\n\n		<h2 class="f-bold">Thank you</h2>\n		<p class="f-regular">Your #wagamamastar is hanging on our tree + we\'ve donated £1 to uk youth! we\'ve sent your friend a link to find their star + you could both win free wagamama for a year.</p>\n\n		<p><a href="#restart/" class="btn restart">Add another star</a></p>\n\n		<p class="f-regular star-message faded color-' +
((__t = ( treecolour )) == null ? '' : __t) +
'">HERE WE GO</p>\n	</div>\n</div>';

}
return __p
}})();;