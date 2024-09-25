import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Page, LegacyCard, Button} from '@shopify/polaris';

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppProvider i18n={enTranslations}>
      <h1 className="text-3xl font-bold underline">
        <Button variant='primary'>xd</Button>
      </h1>
    </AppProvider>
  )
}

export default App
