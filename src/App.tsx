import { Toaster } from './components/ui/toaster';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

export default function App() {
    return (
        <>
            <div className="px-8 py-8 min-h-screen max-w-screen flex flex-col justify-between">
                <MainContent />
                <Footer />
            </div>
            <Toaster />
        </>
    );
}
