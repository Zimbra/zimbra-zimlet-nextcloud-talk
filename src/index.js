//Load components from Zimbra
import { createElement } from 'preact';

//Load the createMore function from our Zimlet component
import CreateMore from './components/more';

//Create function by Zimbra convention
export default function Zimlet(context) {
	//Get the 'plugins' object from context and define it in the current scope
	const { plugins } = context;
	const exports = {};

	exports.init = function init() {
		// The zimlet slots to load into, and what is being loaded into that slot
		// See: https://github.com/Zimbra/zimlet-cli/wiki/Zimlet-Context
		plugins.register('slot::calendar-appointment-edit-video-call', props => (
			<CreateMore {...props} context={context} />
		));
	};

	return exports;
}
