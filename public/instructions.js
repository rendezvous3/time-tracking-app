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
// these bottom-level components — also known as leaf components — hold the majority of the page’s HTML.
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

// Looping through our state in EditableTimerList

class EditableTimerList extends React.Component {
  render() {
  	const timers = this.props.timers.map((timer) => (
			<EditableTimer
				key = {timer.id}
				id = {timer.id}
		    title={timer.title}
		    project={timer.project}
		    elapsed={timer.elapsed}
		    runningSince={timer.runningSince}
		    editFormOpen={false}
	  	/>
		));
    return (
      <div id='timers'>
      	{timers}
      </div>
    );
  }
}

// Props vs. state

// Remember, props are state’s immutable accomplice. What existed as mutable state in Timers-
// Dashboard is passed down as immutable props to EditableTimerList.
// props act as its one-way data pipeline. State is managed in some select parent components
// and then that data flows down through children as props.
// If state is updated, the component managing that state re-renders by calling render().
// This, in turn, causes any of its children to re-render as well. And the children of those children.
// And on and on down the chain.

// Adding state to EditableTimer

// In the static version of our app, EditableTimer relied on editFormOpen as a prop to be passed down
// from the parent. We decided that this state could actually live here in the component itself.
// We’ll set the initial value of editFormOpen to false, which means that the form starts off as closed.
// We’ll also pass the id property down the chain:

class EditableTimer extends React.Component {
	state = {
		editFormOpen: false,
	}
  render() {
    if (this.state.editFormOpen) {
      return (
        <TimerForm
        	id={this.props.id}
          title={this.props.title}
          project={this.props.project}
        />
      );
    } else {
      return (
        <Timer
        	id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          elapsed={this.props.elapsed}
          runningSince={this.props.runningSince}
        />
      );
    }
  }
}

// Timer remains stateless

// If you look at Timer, you’ll see that it does not need to be modified. It has been using exclusively
// props and is so far unaffected by our refactor

// Adding state to ToggleableTimerForm

// We want to have the component manage the state isOpen. Because this state is isolated to this component,
// let’s also add our app’s first bit of interactivity while we’re here.
// As we explored at the end of the last chapter, we need to write this function as an arrow function
// in order to ensure this inside the function is bound to the component. 
// React will automatically bind class methods corresponding to the component API 
// (like render and componentDidMount) to the component for us.

// As a refresher, without the property initializer feature we’d write our custom component method like this:

handleFormOpen() {
 this.setState({ isOpen: true });
}

// Our next step would be to bind this method to the component inside the constructor, like this:

constructor(props) { 
	super(props);

	this.handleFormOpen = this.handleFormOpen.bind(this); 
}

// Like the up-vote button in the last app, we use the onClick property on button to invoke the 
// function handleFormOpen(). handleFormOpen() modifies the state, setting isOpen to true.
// This causes the component to re-render. When render() is called this second time around,
// this.state.isOpen is true and ToggleableTimerForm renders TimerForm. Neat.


// Adding state to TimerForm

// We mentioned earlier that TimerForm would manage state as it includes a form. In React, forms are
// stateful. Recall that TimerForm includes two input fields, These input fields are modifiable by the user
// In React, all modifications that are made to a component should be handled by React and kept in state.
// This includes changes like the modification of an input field.
// By having React manage all modifications, we guarantee that the visual component that the user 
// is interacting with on the DOM matches the state of the React component behind the scenes.

class TimerForm extends React.Component {
  state = {
    title: this.props.title || '',
    project: this.props.project || '',
};

// Our state object has two properties, each corresponding to an input field that TimerForm manages.
// We set the initial state of these properties to the values passed down via props.
// If TimerForm is creating a new timer as opposed to editing an existing one, those props would be undefined.
// In that case, we initialize both to a blank string ('').

// defaultValue only sets the value of the input field for the initial render.
// Instead of using defaultValue, we can connect our input fields directly to our component’s state using value.
// We could do something like this:

<div className='field'> 
	<label>Title</label>
	<input type='text'
	    value={this.state.title}
	/>
</div>

// With this change, our input fields would be driven by state. Whenever the state properties title 
// or project change, our input fields would be updated to reflect the new value.

// However, this misses a key ingredient: We don’t currently have any way for the user to modify this state.
// The input field will start off in-sync with the component’s state. But the moment the 
// user makes a modification, the input field will become out-of-sync with the component’s state

// We can fix this by using React’s onChange attribute for input elements. Like onClick for button or a elements,
// we can set onChange to a function. Whenever the input field is changed, React will invoke the function 
// specified. Let’s set the onChange attributes on both input fields to functions we’ll define next:


<div className='field'>
	<label>Title</label>
	<input 
		type='text' 
		value={this.state.title}
		onChange={this.handleTitleChange}
	/>
	</div>
<div className='field'>
	<label>Project</label>
	<input 
		type='text' 
		value={this.state.project}
		onChange={this.handleTitleChange}
	/>
</div>

// The functions handleTitleChange and handleProjectChange will both modify their respective
// properties in state. Here’s what they look like:
// When React invokes the function passed to onChange, it invokes the function with an event object.
// We call this argument e. The event object includes the updated value of the field under target.value.
// We update the state to the new value of the input field

// Using a combination of state, the value attribute, and the onChange attribute is the canonical 
// method we use to write form elements in React. We explore forms in depth in the chapter “Forms.” 
// We explore this topic specifically in the section “Uncontrolled vs. Controlled Components.”

// To recap, here’s an example of the lifecycle of TimerForm:

// 1. On the page is a timer with the title “Mow the lawn.”
// 2. The user toggles open the edit form for this timer, mounting TimerForm to the page.
// 3. TimerForm initializes the state property title to the string "Mow the lawn"
// 4. The user modifies the input field, changing it to the value "Cut the grass".
// 5. With every keystroke, React invokes handleTitleChange. The internal state of title is kept
// in-sync with what the user sees on the page.

// With TimerForm refactored, we’ve finished establishing our stateful data inside our elected components.
// Our downward data pipeline, props, is assembled.
// We’re ready — and perhaps a bit eager — to build out interactivity using inverse data flow.

// Step 6: Add inverse data flow

// As we saw in the last chapter, children communicate with parents by calling functions 
// that are handed to them via props.
// In the ProductHunt app, when an up-vote was clicked Product didn’t do any data management. 
// It was not the owner of its state. Instead, it called a function given to it by ProductList,
// passing in its id. ProductList was then able to manage state accordingly.


// TimerForm needs to propagate create and update events (create while under Toggleable- 
// TimerForm and update while under EditableTimer). Both events will eventually reach TimersDashboard.
// Timer has a fair amount of behavior. It needs to handle delete and edit clicks,
// as well as the start and stop timer logic.

// TimerForm

// TimerForm needs two event handlers:

// When the form is submitted (creating or updating a timer)
// When the “Cancel” button is clicked (closing the form)

// TimerForm will receive two functions as props to handle each event. The parent component that uses
// TimerForm is responsible for providing these functions:

// props.onFormSubmit(): called when the form is submitted
// props.onFormClose(): called when the “Cancel” button is clicked

// As we’ll see soon, this empowers the parent component to dictate what the behavior should be when
// these events occur

 <div className='ui two bottom attached buttons'>
	<button
	  className='ui basic blue button'
	  onClick={this.handleSubmit}
	>
	  {submitText}
	</button>
	<button
	  className='ui basic red button'
	  onClick={this.props.onFormClose}
	>
	  Cancel
	</button>
</div>

handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project,
}); };

// handleSubmit() calls a yet-to-be-defined function, onFormSubmit(). It passes in a data object with
// id, title, and project attributes. This means id will be undefined for creates, as no id exists yet. 
// Before moving on, let’s make one last tweak to TimerForm:    

render() {
  const submitText = this.props.id ? 'Update' : 'Create';


// We have submitText switch on id as opposed to title.
// Using the id property to determine whether or not an object has been created is a more common practice.

  










