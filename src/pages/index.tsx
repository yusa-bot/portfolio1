import Layout from "../Layout";
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
};

function _getCurrentPage(url: string): string {
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  let urlLastPart = url.split('/').pop() || '';
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
        <Route path="/top" element={<Top />} />
        <Route path="/me" element={<Me />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/techstack" element={<TechStack />} />
        <Route path="/updates" element={<Updates />} />
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
