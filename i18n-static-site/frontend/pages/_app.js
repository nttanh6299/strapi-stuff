import '../styles/globals.css'
    
import { appWithTranslation } from 'next-i18next';
    
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
    
//Wrap appWithTranslation around your app
export default appWithTranslation(MyApp);