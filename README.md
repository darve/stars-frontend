## Front-end documentation

#### Routing

- `/` Landing Page
- `/get-started` Terms & Conditions
- `/enter` Enter name, email address
- `/decorate` Enter message for the star
- `/share` View message and choose a share method (email or facebook)
- `/share/email` Enter email address of friend
- `/share/facebook` Facebook share prompt (??)
- `/thank-you/` Successfully shared
- `/star/` View a star that has been shared with you
- `/star-removed/` Star removed due to moderated content
- `/competition-closed/` Competition closed - sign up to recieve our newsletter


#### API

- `/data/save-data` POST user's name, email address data -> returns a unique url
- `/data/send-message` POST to trigger an email sharing their star

#### Animation

1. Tree.js has a rendering loop which triggers the `tick` function of each star.
2. Suggest Tree.js keeps track of the number of frames that have been rendered and passes this number to the tick function, instead of each star working out the current time.
3. Each animation can them remember the frame at which it started, and work out the frame at which it needs to finish.


#### Animation queue

1. An animation is queued up with end properties
2. The queue function accepts this and generates start properties based on the current point in time - this will only work if the queue is empty. If it is not, we should get the next item in the queue.

1. An animation is finished - do we need to do anything other than kill the old array entry?

`
transitions: { position: [1, 2, 3]}
`

#### Analytics tracking labels

- 'User Journey'
- 'Sharing'
- 'Login'
- 'Star Viewed'
- 'Outbound Link'