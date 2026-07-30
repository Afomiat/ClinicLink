import { useEffect } from 'react';
import AppRouter from './routes/AppRouter.jsx';

const App = () => {
  useEffect(() => {
    // useEffect runs after the browser has painted the first frame,
    // so the dashboard is already visible when the loader fades out.
    if (typeof window.clDismissLoader === 'function') {
      window.clDismissLoader();
    }
  }, []);

  return (
    <div className="app">
      <AppRouter />
    </div>
  );
};

export default App;