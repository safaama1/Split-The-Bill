# Split The Bill<br/>
Split The Bill is an app that allows its users to share their bill online with their friends and see the exact amount they owe for their items without the hassle of calculating it themselves the process is easy just take a picture of your bill share the room number with your friends so they can join and then each user can pick the items they bought and the app creates a personalized bill for each user. 
**Application Functions**:
1. Scanning the bill and turning it into a digital list of items & prices where items can be marked and selected.
2. Sharing all users on the same digital list.
3. The user selects several items from the list and the application calculates their total price.
4. The list is updated for all users and next to each item is the name of the person who selected it.

We used socket.io to let people join or create rooms that show the items on the bill; every time a person chooses an item, the bill gets updated and shows the other users in the room that the item has been taken.<br/>
