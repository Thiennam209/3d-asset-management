import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';

import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import { store } from './app/store'
import { Provider } from 'react-redux'
import App from './App';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
// import 'mdbreact/dist/css/mdb.css';

ReactDOM.render(
	<Provider store={store}>
		<ChakraProvider theme={theme}>
			<React.StrictMode>
				<ThemeEditorProvider>
					<App />
				</ThemeEditorProvider>
			</React.StrictMode>
		</ChakraProvider>
	</Provider>,
	document.getElementById('root')
);
