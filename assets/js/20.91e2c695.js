(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{556:function(e,t,o){"use strict";o.r(t);var a=o(10),r=Object(a.a)({},(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[o("h1",{attrs:{id:"what-are-reaction-roles-used-for"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#what-are-reaction-roles-used-for"}},[e._v("#")]),e._v(" What are reaction roles used for?")]),e._v(" "),o("p",[e._v("Have you ever gone through the trouble of creating roles for users to assign themselves only for them to never to do so? Do your users play a new game where it’d be useful to know which server other gamers are playing on? Do you wish there were a visually attractive way to sign up for multiple roles that didn’t involve typing out a command several times? Well then, have we got a command for you!")]),e._v(" "),o("ul",[o("li",[e._v("✅ Allow users to assign roles to themselves by tapping a reaction.")]),e._v(" "),o("li",[e._v("✅ Can create an alternate verification process")]),e._v(" "),o("li",[e._v("✅ Sign up for roles that can be used in conjunction with the Events feature")]),e._v(" "),o("li",[e._v("✅ Create teams, sort users by geographical location, favorite server, etc.")])]),e._v(" "),o("p",[e._v("Reaction roles are a fun, easy and visual way for users to assign roles to themselves without having to go through the effort of having to type .give role.")]),e._v(" "),o("h2",{attrs:{id:"reaction-roles-associated-commands"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#reaction-roles-associated-commands"}},[e._v("#")]),e._v(" Reaction Roles, Associated Commands")]),e._v(" "),o("table",[o("thead",[o("tr",[o("th"),e._v(" "),o("th"),e._v(" "),o("th")])]),e._v(" "),o("tbody",[o("tr",[o("td",[e._v("Command")]),e._v(" "),o("td",[e._v("Purpose")]),e._v(" "),o("td",[e._v("Alias")])]),e._v(" "),o("tr",[o("td",[e._v(".emojis")]),e._v(" "),o("td",[e._v("Shows a list of all emoji added to your global database")]),e._v(" "),o("td",[e._v(".em")])]),e._v(" "),o("tr",[o("td",[e._v(".emojicreate name emoji")]),e._v(" "),o("td",[e._v("Creates an emoji that you can use on any discord server!")]),e._v(" "),o("td",[e._v(".emc")])]),e._v(" "),o("tr",[o("td",[e._v(".emojidelete name")]),e._v(" "),o("td",[e._v("Deletes an emoji from your global database")]),e._v(" "),o("td",[e._v(".emd")])]),e._v(" "),o("tr",[o("td",[e._v(".reactionrolecreate msgID Name Emoji Role/RoleID/Role Name")]),e._v(" "),o("td",[e._v("Create a reaction role with the given emoji and role to add when a user clicks/taps")]),e._v(" "),o("td",[e._v(".rrc")])]),e._v(" "),o("tr",[o("td",[e._v(".reactionroledelete name")]),e._v(" "),o("td",[e._v("Deletes the desired reaction role")]),e._v(" "),o("td",[e._v(".rrd")])]),e._v(" "),o("tr",[o("td",[e._v(".reactionroleadd name emoji Role/RoleID/Role name")]),e._v(" "),o("td",[e._v("Adds the emoji to the reaction role and adds the role to be added when clicking said emoji.")]),e._v(" "),o("td",[e._v(".rra")])]),e._v(" "),o("tr",[o("td",[e._v(".reactionroleremove name emoji")]),e._v(" "),o("td",[e._v("Removes the specified emoji from the reaction role")]),e._v(" "),o("td")])])]),e._v(" "),o("blockquote",[o("p",[e._v("Items listed in bold/italic are variables. Ie. **_name = _**what you wish to call the emoji. You wouldn’t type "),o("strong",[o("em",[e._v("name")])]),e._v(". In addition, "),o("strong",[o("em",[e._v("emoji")])]),e._v(" refers to an emoji added to the global database, not server emoji.")])]),e._v(" "),o("h2",{attrs:{id:"getting-started-with-reaction-roles"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#getting-started-with-reaction-roles"}},[e._v("#")]),e._v(" Getting Started with Reaction Roles")]),e._v(" "),o("h3",{attrs:{id:"enabling-developer-mode"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#enabling-developer-mode"}},[e._v("#")]),e._v(" Enabling Developer Mode")]),e._v(" "),o("p",[e._v("We need to enable developer mode so that we will be able to copy MessageIDs, which are necessary for building our reaction roles down the line. In order to do this we first click on the user settings cog. In the sidebar that now exists, we navigate to “Appearance”. On the right side of the pane should now exist the “Developer Mode” toggle near the bottom of the screen (may need to scroll some). Toggle this to on. That’s it! Now we’re ready to get some IDs!")]),e._v(" "),o("h3",{attrs:{id:"creating-your-embed-message"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#creating-your-embed-message"}},[e._v("#")]),e._v(" Creating your Embed/Message")]),e._v(" "),o("p",[e._v("In order to use our newfound powers, we will have to create a message or an embed to use as our reaction role. **Beware that whatever channel it is created in, it will have to stay there - you cannot call the reactionrole message later in a different channel. **Once you have your channel and permissions created if necesary, go ahead and either type a message or create an embed using "),o("code",[e._v(".embed @user {object}.")]),e._v("You can use User Variables (shown below) if you mention a user during embed creation. Now, you COULD create the embed by hand but obviously it’s much simpler just to use the "),o("a",{attrs:{href:"https://embedbuilder.nadekobot.me/",target:"_blank",rel:"noopener noreferrer"}},[e._v("nadeko embed builder!"),o("OutboundLink")],1)]),e._v(" "),o("p",[e._v("Once your embed or message is in place it’s time to add some emoji!")]),e._v(" "),o("h3",{attrs:{id:"messageid-and-adding-emoji"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#messageid-and-adding-emoji"}},[e._v("#")]),e._v(" MessageID and Adding Emoji")]),e._v(" "),o("p",[e._v("We now have our embed! Go ahead and type .embed + paste your code from nadeko. Using the three dot menu on desktop, or long pressing on mobile you can copy the message ID. You will need this for your reaction role creation.")]),e._v(" "),o("p",[e._v("Now to add some emojis to your global database: type .emojicreate name and the emoji you wish to add. For example .emojicreate agree :whitecheckmark: would create an emoji in your database called agree that would look like whitecheckmark. These emoji will come with you from server to server, so even if you don’t have discord nitro, you can use your emoji in different servers when you set up events. Neat, huh?")]),e._v(" "),o("h3",{attrs:{id:"adding-roles"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#adding-roles"}},[e._v("#")]),e._v(" Adding Roles")]),e._v(" "),o("p",[e._v("The last part of this reaction role "),o("em",[e._v("mise en place")]),e._v(" is setting up the roles that you want to assign in your reaction role. I won’t cover this as it’s assumed you know how to create a role and set permissions within discord. Just a reminder section that you need to create these roles first as we’ll use them in the next section.")]),e._v(" "),o("h2",{attrs:{id:"creating-your-reactionrole"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#creating-your-reactionrole"}},[e._v("#")]),e._v(" Creating Your ReactionRole")]),e._v(" "),o("h3",{attrs:{id:"reactionrolecreate-rrc"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#reactionrolecreate-rrc"}},[e._v("#")]),e._v(" .reactionrolecreate / .rrc")]),e._v(" "),o("p",[e._v("To create your first reaction role you need all the pieces in place from the prior section. You will need:")]),e._v(" "),o("ul",[o("li",[e._v("Emojis")]),e._v(" "),o("li",[e._v("Roles")]),e._v(" "),o("li",[e._v("MessageID")])]),e._v(" "),o("p",[e._v("So now that we have all those, let’s begin. In the channel with the message "),o("strong",[e._v(".rrc will not work if you try to run it from outside the channel with the message you’re working with")]),e._v(" type;")]),e._v(" "),o("p",[o("code",[e._v(".reactionrolecreate messageID NAME EMOJI ROLE")])]),e._v(" "),o("p",[e._v("Where")]),e._v(" "),o("ul",[o("li",[e._v("NAME is the title that you wish to assign to the reaction role (important for manipulation of the reactionrole later)")]),e._v(" "),o("li",[e._v("ROLE is the role that you wish a user to obtain when they click the reaction")]),e._v(" "),o("li",[e._v("EMOJI is the emoji that a user will click to obtain the role. This will be the name in the global database you assigned in the earlier steps")])]),e._v(" "),o("p",[e._v("When you’re done you should get a confirmation of success and you should now see your message has a reaction. Go ahead and test it out! If you only wish to add one reactionrole to your message you’re done! If you wish to add additional reactions read on!")]),e._v(" "),o("h3",{attrs:{id:"reactionroleadd-rra"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#reactionroleadd-rra"}},[e._v("#")]),e._v(" .reactionroleadd / .rra")]),e._v(" "),o("p",[e._v("If you wish to add additional reactionroles type")]),e._v(" "),o("p",[o("code",[e._v(".reactionroleadd EMOJI ROLE")]),e._v(" with the emoji and role combination you wish to add. It’s that simple. Repeat for any remaining roles you wish to assign.")]),e._v(" "),o("blockquote",[o("p",[e._v("It's important to notice that while you must use reactionrolecreate in the channel with the messageID, you can use .reactionroleadd from any channel. Due to the intricacies of coding that are beyond this humble guide-writer, it's not possible to have .reactionrolecreate run from different channels, but at least adding additional reactionroles doesn't have to mean endless botspam in your message channel.")])]),e._v(" "),o("h3",{attrs:{id:"reactionroledelete-rrd-vs-reactionroleremove-rrr"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#reactionroledelete-rrd-vs-reactionroleremove-rrr"}},[e._v("#")]),e._v(" .reactionroledelete / .rrd vs. .reactionroleremove / .rrr")]),e._v(" "),o("p",[e._v("So you’re pretty much done! You’ll notice however that there are two more .reactionrole commands we haven’t touched. First, .reactionroleremove is for if, let’s say you’ve decided you no longer need to have a “north american” role assigned from your reactionrole. You can type "),o("code",[e._v(".reactionroleremove NAME north american")]),e._v(" to remove "),o("em",[e._v("one specific reaction role from a message.")]),e._v(" If you decided to remove the entire reaction role for some reason, you can delete "),o("em",[e._v("the entire set of reactionroles")]),e._v(" by typing "),o("code",[e._v(".reactionroledelete NAME.")])]),e._v(" "),o("h2",{attrs:{id:"reaction-role-cheat-sheet"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#reaction-role-cheat-sheet"}},[e._v("#")]),e._v(" Reaction Role Cheat Sheet")]),e._v(" "),o("ol",[o("li",[e._v("Enable Developer mode")]),e._v(" "),o("li",[e._v("Create your embed/message")]),e._v(" "),o("li",[e._v("Add your Emoji")]),e._v(" "),o("li",[e._v("Create your roles")]),e._v(" "),o("li",[e._v("Copy your message ID")]),e._v(" "),o("li",[e._v(".reactionrolecreate NAME MessageID EMOJI ROLE")])]),e._v(" "),o("h2",{attrs:{id:"color-wheel"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#color-wheel"}},[e._v("#")]),e._v(" Color Wheel")]),e._v(" "),o("p",[e._v("If you are looking to create a reaction role for colored roles, this is a built in feature of Gamer that you can do automatically. Just run the following command: "),o("code",[e._v(".reactionrolecreate setup")])]),e._v(" "),o("h2",{attrs:{id:"unique-role-sets"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#unique-role-sets"}},[e._v("#")]),e._v(" Unique Role Sets")]),e._v(" "),o("p",[e._v("Gamer also has an additional feature called Unique Role Sets which can be tied in with Reaction Roles. This can be used to remove other roles when a user is given a role.")]),e._v(" "),o("p",[e._v("Basically, when a user is granted a role, you can remove every role that is in a set with that role. Let's take an example, when you are playing a game with several regions you might have roles like this:")]),e._v(" "),o("ul",[o("li",[e._v("NA")]),e._v(" "),o("li",[e._v("EA")]),e._v(" "),o("li",[e._v("EU")]),e._v(" "),o("li",[e._v("SA")]),e._v(" "),o("li",[e._v("SEA")]),e._v(" "),o("li",[e._v("CN")])]),e._v(" "),o("p",[e._v("You can use Unique Role Sets to make sure that a player never has more than 1 of these roles at any time. In regards to verification, we can do something like this where we create a roleset of the following roles:")]),e._v(" "),o("ul",[o("li",[e._v("Verify")]),e._v(" "),o("li",[e._v("Verified")])]),e._v(" "),o("p",[e._v("Now whenever someone is given the Verified role by the reaction role, Gamer bot will remove the Verify role.")])])}),[],!1,null,null,null);t.default=r.exports}}]);