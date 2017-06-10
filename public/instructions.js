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

// Inside TimersDashboard are two child components: EditableTimerList and ToggleableTimerForm.
// EditableTimerList contains two EditableTimer components.
// The first of these has a Timer component as a child and the second a TimerForm.
// hese bottom-level components — also known as leaf components — hold the majority of the page’s HTML.
// ToggleableTimerForm renders a TimerForm. Notice how the two forms on the page have different language
// for their buttons, as the first is updating and the second is creating.

// Step 3: Determine what should be stateful

// In order to bestow our app with interactivity, we must evolve it from its static existence to a mutable one.
// The first step is determining what, exactly, should be mutable.
// Let’s start by collecting all of the data that’s employed by each component in our static app.
// In our static app, data will be wherever we are defining or using props.
// We will then determine which of that data should be stateful.

// TimersDashboard

// In our static app, this declares two child components.
// It sets one prop, which is the isOpen boolean that is passed down to ToggleableTimerForm.

// EditableTimerList

// This declares two child components, each which have props corresponding to a given timer’s properties.

// EditableTimer

// This uses the prop editFormOpen

// Timer

// This uses the prop editFormOpen

// TimerForm

// This has two interactive input fields, one for title and one for project.
// When editing an existing timer, these fields are initialized with the timer’s current values.

// State criteria

// 1. Is it passed in from a parent via props? If so, it probably isn’t state.

// A lot of the data used in our child components are already listed in their parents.
// This criterion helps us de-duplicate.

// For example, “timer properties” is listed multiple times
// When we see the properties declared in EditableTimerList, 
// we can consider it state. But when we see it elsewhere, it’s not.

// 2. Does it change over time? If not, it probably isn’t state

// This is a key criterion of stateful data: it changes.

// 3. Can you compute it based on any other state or props in your component? If so, it’s not state.

// For simplicity, we want to strive to represent state with as few data points as possible.


// Applying the criteria

// TimersDashboard

// isOpen boolean for ToggleableTimerForm

// Stateful. The data is defined here. It changes over time. And it cannot be computed from other state
// or props.

// EditableTimerList

// Timer properties

// Stateful. The data is defined in this component, changes over time,
// and cannot be computed from other state or props

// EditableTimer

// editFormOpen for a given timer

// Stateful. The data is defined in this component, changes over time, and cannot be computed from
// other state or props.


// Timer

// Timer properties

// In this context, not stateful. Properties are passed down from the parent.

// TimerForm

// We might be tempted to conclude that TimerForm doesn’t manage any stateful data,
// as title and project are props passed down from the parent. However, as we’ll see,
// forms are special state managers in their own right.

// So, outside of TimerForm, we’ve identified our stateful data:

// The list of timers and properties of each timer
// Whether or not the edit form of a timer is open
// Whether or not the create form is open

// Step 4: Determine in which component each piece of state should live

// While the data we’ve determined to be stateful might live in certain components in our static app,
// this does not indicate the best position for it in our stateful app. 
// Our next task is to determine the optimal place for each of our three discrete pieces of state to live.

// https://facebook.github.io/react/docs/thinking-in-react.html
// https://facebook.github.io/react/docs/state-and-lifecycle.html


// For each piece of state:

// Identify every component that renders something based on that state.
// Find a common owner component(a single component above all the components
// that need the state in the hierarchy).
// Either the common owner or another component higher up in the hierarchy
// should own the state.
// If you can’t find a component where it makes sense to own the state,create a new
// component simply for holding the state and add it somewhere in the hierarchy
// above the common owner component.

// Let’s apply this method to our application:

// The list of timers and properties of each timer

// At first glance, we may be tempted to conclude that TimersDashboard does not appear to use this state
// Because ToggleableTimerForm doesn’t appear to use the state either,
// we might deduce that EditableTimerList must then be the common owner
// While this may be the case for displaying timers, modifying them, and deleting them, what about creates?
// ToggleableTimerForm does not need the state to render, but it can affect state
// It needs to be able to insert a new timer. It will propagate the data for the new timer up to TimersDashboard.
// Therefore, TimersDashboard is truly the common owner. 
// It will render EditableTimerList by passing down the timer state. 
// It can the handle modifications from EditableTimerList and creates from ToggleableTimerForm,
// mutating the state. The new state will flow downward through EditableTimerList

// Whether or not the edit form of a timer is open

// In our static app, EditableTimerList specifies whether or not a EditableTimer should be rendered 
// with its edit form open. Technically, though, this state could just live in each individual Editable- Timer.
// No parent component in the hierarchy depends on this data
// Storing the state in EditableTimer will be fine for our current needs.
// But there are a few requirements that might require us to “hoist” 
// this state up higher in the component hierarchy in the future.
// For instance, what if we wanted to impose a restriction such that only one edit form could be open at a time?
// If we wanted to allow only one form open at all, including the create form,
// then we’d hoist the state up to TimersDashboard.

// Visibility of the create form

// TimersDashboard doesn’t appear to care about whether ToggleableTimerForm is open or closed. 
// It feels safe to reason that the state can just live inside ToggleableTimerForm itself

// So, in summary, we’ll have three pieces of state each in three different components:

// Timer data will be owned and managed by TimersDashboard.
// Each EditableTimer will manage the state of its timer edit form.
// The ToggleableTimerForm will manage the state of its form visibility.


// Step 5: Hard-code initial states

// We’re now well prepared to make our app stateful. At this stage, we won’t yet communicate with the server.
// Instead, we’ll define our initial states within the components themselves. 
// This means hard-coding a list of timers in the top-level component, TimersDashboard. 
// For our two other pieces of state, we’ll have the components’ forms closed by default.
// After we’ve added initial state to a parent component, we’ll make sure our props are 
// properly established in its children.

// Adding state to TimersDashboard

class TimersDashboard extends React.Component {
  state = {
    timers: [
      {
        title: 'Practice squat',
        project: 'Gym Chores',
        id: uuid.v4(),
        elapsed: 5456099,
        runningSince: Date.now(),
		}, {
        title: 'Bake squash',
        project: 'Kitchen Chores',
        id: uuid.v4(),
        elapsed: 1273998,
        runningSince: null,
		}, 
	],
};
render() {
return (
  <div className='ui three column centered grid'>
    <div className='column'>
      <EditableTimerList timers={this.state.timers} />
      <ToggleableTimerForm
        isOpen={true}
      />













