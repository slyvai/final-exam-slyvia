
import './globals.css'; 
import LayoutApp from '../components/LayoutApp';
import { AppProvider } from '../context/AppContext';

export default function App({ Component, pageProps }) {
  return (
    <>
    <AppProvider>
    <LayoutApp>
  <Component {...pageProps} />
  </LayoutApp>
  </AppProvider>
  </>
);
}