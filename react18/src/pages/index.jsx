import Layout from "./Layout.jsx";

import Top from "./Top";

import Me from "./Me";

import Contact from "./Contact";

import TechStack from "./TechStack";

import Updates from "./Updates";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Top: Top,
    
    Me: Me,
    
    Contact: Contact,
    
    TechStack: TechStack,
    
    Updates: Updates,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Top />} />
                
                
                <Route path="/Top" element={<Top />} />
                
                <Route path="/Me" element={<Me />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/TechStack" element={<TechStack />} />
                
                <Route path="/Updates" element={<Updates />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}