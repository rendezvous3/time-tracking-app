// 1. Break the app into components
	// We looked at the desired UI and determined we wanted ProductList and Product components.
// 2. Build a static version of the app
 	// Our components started off without using state. 
 	// Instead, we had ProductList pass down static props to Product.
// 3. Determine what should be stateful
	// In order for our application to become interactive, we had to be able to modify the vote property
	// on each product. Each product had to be mutable and therefore stateful.
// 4. Determine in which component each piece of state should live
	// ProductList managed the voting state using React component class methods.
// 5. Hard-code initial states
	// When we re-wrote ProductList to use this.state, we seeded it from Seed.products.
// 6. Add inverse data flow	
	// We defined the handleUpVote function in ProductList and passed it down in props so 
	// that each Product could inform ProductList of up-vote events.
// 7. Add server communication
	// We did not add a server component to our last app, but we will be doing so in this one


// Step 2: Build a static version of the app

// TimersDashboard