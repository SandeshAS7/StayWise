import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Property } from './types';
import { api } from './services/api';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'details' | 'student-dashboard' | 'owner-dashboard' | 'admin-dashboard'>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchFilters, setSearchFilters] = useState<{ location?: string; gender?: string; maxRent?: number }>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Initial load of featured properties
    api.getProperties({ size: 12 })
      .then(res => setProperties(res.content))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (user?.role === 'ROLE_STUDENT') {
      api.getWishlist()
        .then(items => setWishlistIds(items.map(p => p.id)))
        .catch(console.error);
    } else {
      setWishlistIds([]);
    }
  }, [user]);

  const handleToggleWishlist = async (propertyId: number) => {
    if (!user) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }

    if (wishlistIds.includes(propertyId)) {
      try {
        await api.removeFromWishlist(propertyId);
        setWishlistIds(wishlistIds.filter(id => id !== propertyId));
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await api.addToWishlist(propertyId);
        setWishlistIds([...wishlistIds, propertyId]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchTrigger = (filters: { location?: string; gender?: string; maxRent?: number }) => {
    setSearchFilters(filters);
    setCurrentView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openAuthModal={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        wishlistCount={wishlistIds.length}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            properties={properties}
            onSelectProperty={handlePropertySelect}
            onSearch={handleSearchTrigger}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentView === 'search' && (
          <SearchPage
            initialFilters={searchFilters}
            onSelectProperty={handlePropertySelect}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentView === 'details' && selectedProperty && (
          <PropertyDetailPage
            property={selectedProperty}
            onBack={() => setCurrentView('search')}
            isWishlisted={wishlistIds.includes(selectedProperty.id)}
            onToggleWishlist={handleToggleWishlist}
            openAuthModal={() => {
              setAuthMode('login');
              setIsAuthOpen(true);
            }}
          />
        )}

        {currentView === 'student-dashboard' && (
          <StudentDashboard onSelectProperty={handlePropertySelect} />
        )}

        {currentView === 'owner-dashboard' && (
          <OwnerDashboard />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard />
        )}
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
